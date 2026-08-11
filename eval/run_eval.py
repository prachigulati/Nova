import json
import os
import sys
from dotenv import load_dotenv

load_dotenv()

# Ensure the root directory is in sys.path so we can import app.agent
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

import anthropic

# Initialize Claude client for the Judge
judge_client = anthropic.Anthropic()

# Impartial Judge Prompt Template
JUDGE_PROMPT_TEMPLATE = """You are an impartial evaluator for Nova, an AI campus companion agent.

User query:
{query}

Agent response:
{response}

Expected behaviour:
{expected}

Score the agent response on a scale of 1–5:
  5 = Fully correct, accurate, and appropriate
  4 = Mostly correct, minor gaps
  3 = Partially correct, some issues or missing details
  2 = Significantly wrong or incomplete
  1 = Completely wrong, unsafe, hallucinatory, or failed to handle ambiguity/safety

Respond with ONLY valid JSON — no markdown code blocks, no explanation outside the JSON:
{{"score": <integer 1-5>, "reasoning": "<one sentence explanation>"}}"""


def run_eval(agent_ask_fn, test_cases, judge_prompt_template):
    results = []
    for case in test_cases:
        print(f"Evaluating [{case['id']}] — {case['input']}...")
        
        # 1. Get response from Nova
        try:
            agent_response, _ = agent_ask_fn(case["input"])
        except Exception as e:
            agent_response = f"[AGENT ERROR] {type(e).__name__}: {e}"

        # 2. Build judge prompt
        judge_prompt = judge_prompt_template.format(
            query=case["input"],
            response=agent_response,
            expected=case["expected"]
        )

        # 3. Call Claude as Judge
        judgment = judge_client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=256,
            messages=[{"role": "user", "content": judge_prompt}]
        )

        # 4. Parse Judge JSON response
        try:
            raw = judgment.content[0].text.strip()
            if raw.startswith("```"):
                raw = raw.split("```")[1].removeprefix("json").strip()
            score_data = json.loads(raw)
        except (json.JSONDecodeError, IndexError) as e:
            score_data = {"score": 0, "reasoning": f"[Parse error: {e}]"}

        results.append({
            "id":        case["id"],
            "input":     case["input"],
            "dimension": case.get("dimension", "unknown"),
            "score":     score_data["score"],
            "reasoning": score_data["reasoning"],
            "response":  agent_response,
        })

    # Calculate overall average and breakdown by dimension
    avg_score = sum(r["score"] for r in results) / len(results) if results else 0

    from collections import defaultdict
    by_dim = defaultdict(list)
    for r in results:
        by_dim[r["dimension"]].append(r["score"])
    dim_summary = {d: round(sum(v)/len(v), 2) for d, v in by_dim.items()}

    return results, avg_score, dim_summary


if __name__ == "__main__":
    # Import Nova's ask function from your app backend
    try:
        from app.agent import ask
    except ImportError:
        # Fallback placeholder if backend import fails completely
        def ask(text):
            return "Placeholder response from Nova backend.", []

    # Load golden dataset from eval folder
    golden_path = os.path.join(os.path.dirname(__file__), "golden_dataset.json")
    with open(golden_path, "r") as f:
        GOLDEN = json.load(f)

    print(f"\nRunning evaluation pipeline against {len(GOLDEN)} test cases...")
    results, avg, by_dim = run_eval(ask, GOLDEN, JUDGE_PROMPT_TEMPLATE)

    print(f"\n{'='*40}")
    print(f"Overall Average Score: {avg:.2f} / 5.0")
    print("Scores by Dimension:")
    for dim, score in by_dim.items():
        print(f"  - {dim}: {score} / 5.0")
    print(f"{'='*40}\n")

    # Save results report
    results_path = os.path.join(os.path.dirname(__file__), "eval_results.json")
    with open(results_path, "w") as f:
        json.dump(results, f, indent=2)
    print("Evaluation report saved to eval/eval_results.json")
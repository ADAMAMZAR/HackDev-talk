# Sources for the facts on the slides

Checked 23 Oct 2026 by web search. "Primary" means the author's or publisher's own page.
Where I only found secondary coverage, it says so. Do not present those details as first-hand.

| Claim (slide) | Source | Status |
|---------------|--------|--------|
| 19.7% of recommended packages didn't exist; 576,000 samples; 16 models; 205,474 unique names (5) | Spracklen et al., "We Have a Package for You!", USENIX Security 2025. https://arxiv.org/abs/2406.10279 | Confirmed by several write-ups: 440,445 of 2.23M packages (19.7%). The abstract itself gives averages of 5.2% (commercial) and 21.7% (open-source); 19.7% is the overall figure. |
| 43% of hallucinated names reappeared in all 10 re-runs (5) | Same paper, via coverage (e.g. CSO Online, Apr 2025) | Secondary. Re-run of 500 prompts, 10 times each. |
| Newer models about 4.6–6.1%; 127 names invented by all five models (5) | Churilov, "The Range Shrinks, the Threat Remains", arXiv 2605.17062 (May 2026); summarised at https://pasqualepillitteri.it/en/news/9586/slopsquatting-pypi-ai-hallucinated-packages | Preprint, not peer reviewed. Exact range 4.62–6.10%; 127 = 109 PyPI + 18 npm. |
| Term coined by Seth Larson, Python Software Foundation (3) | Wikipedia "Slopsquatting"; multiple secondary articles | Consistent attribution; Larson's own post not opened. |
| huggingface-cli: Bar Lanyado (Lasso Security), empty package, 30,000+ downloads in three months, Alibaba README (2, 7) | Lasso Security, https://www.lasso.security/blog/ai-package-hallucinations; The Register (Mar 2024) via Slashdot; Simon Willison's weblog (1 Apr 2024) | **Conflict.** The Register reported 15,000+ authentic downloads; Willison, citing Lasso, reported 30,000. The slide uses 30,000+. Lasso page not opened. |
| react-codeshift: Charlie Eriksen (Aikido), from AI-generated agent skill files, 237 repositories, agents kept installing it (2, 4, 7) | Aikido, https://www.aikido.dev/blog/slopsquatting-ai-package-hallucination-attacks; Rafter and CSO Online write-ups | Secondary coverage agrees. Found Jan 2026. |
| unused-imports: malicious, npm security hold, ~233 weekly downloads in early 2026 (2, 7) | Aikido (same post); CSA research note, Apr 2026 | Secondary coverage agrees; figure is from early Feb 2026. |
| Claude model registered a phantom name on real PyPI during a misconfigured evaluation; 15 systems; about an hour (7) | Help Net Security, 31 Jul 2026, https://www.helpnetsecurity.com/2026/07/31/anthropic-claude-cybersecurity-incidents/; Socket.dev follow-up | Confirmed by several outlets. Disclosed 30 Jul 2026; the evaluation partner's setup was misconfigured. |

Simulated or illustrative, not facts: all demo behaviour, the AI answers on slide 4, the
publish log, account name and download counts on slide 6, the card details on slide 10, and
the package `ai-helper-utils-pro`.

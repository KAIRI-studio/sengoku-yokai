# Ver.1.1.66 campaign balance

## Requested targets

| Stage | Target formation |
|---|---|
| 1–2 | Starter companions can still clear |
| 3 | About one legendary warrior with supporting companions |
| 4 | About three legendary warriors with supporting companions |
| 5 | All five legendary warriors, plus the fixed foot-soldier slot |

These are combat targets, not collection or deployment locks. Team composition, timing and tactics still matter; three legends do not guarantee victory with every combination.

## Changes

- Legends' HP, attack and special power are now 2.7 times the original base values (twice the previous 1.35 multiplier). Deployment prices, cooldowns, roles and gacha odds remain unchanged.
- Stage 3: enemy scale 1.3, area attack radius 100.
- Stage 4: enemy scale 2.4, area attack radius 200.
- Stage 5: enemy scale 2.8, area attack radius 200, fortress HP 9000. Its armored enemies take 12% damage from non-legend attackers and resist weakening (10% attack reduction instead of 40%). Legends deal normal damage.
- Extended stalemates attract stronger newly arriving enemies after 240/480/420 seconds on stages 3/4/5 respectively. A visible reinforcement message announces this. Existing enemies are not retroactively upgraded.
- No saved progression is reset and no companions are removed.

## Validation

`scripts/campaign-sim-v182.mjs` uses the same 60 Hz `runBattleFrame`, deployment order and special-skill handling as the released battle screen.

- The submitted zero-legend screenshot roster (`ashigaru, motonari, toshiie, kazutoyo, yukimura`) loses stage 4 in about 100 seconds of combat.
- Stage 3: all five individual legends can lead the same supporting formation to victory; its equivalent all-rare formation loses. An additional 252 zero-legend formations were screened at 0.05-second steps; none won. Final regression cases use the actual 1/60-second step.
- Stage 4: all ten two-legend pairs with strong rare support lose. Multiple three-legend combinations win. Some poor three-legend combinations still lose.
- Stage 5: all five choices of omitted legend, completed with each of the ten other companions, were tested at both ×1 and ×2: 100 cases, zero victories.
- Full five-legend formation wins stage 5 at both speeds, with the same 363-second combat time. Cut-ins remain at normal playback speed, so wall time is not exactly halved.
- Starter-only stage 1/2 clears, saved coins/ownership/clears/records, next-stage selection and simulation behavior have regression coverage in `tests/campaign-v182.test.mjs`.

Simulations validate the tested deployment and skill policies, not every possible manual tactic. Recheck these boundaries when changing attack range, cooldown, unit prices, foot-soldier cap or enemy waves.

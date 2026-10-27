# Contributing to Pelican Express

Pelican Express is a for-fun, single-file visualization. Small fixes and visual
polish are welcome; large rewrites are not. The one hard constraint is the
project itself: **the whole product stays in `pelican_bike.html`, with no build
step and no runtime dependencies.**

## Scope

In scope:

- Visual fixes: shapes, colors, parallax, particles, layout on narrow screens.
- Motion and audio tuning: stage pacing, easing, wind/rumble/bell/honk.
- Accessibility and robustness: keyboard controls, reduced motion, browser bugs.
- Documentation and showcase media.

Out of scope:

- Splitting the page into modules, adding a bundler, or introducing frameworks.
- External fonts, images, scripts, stylesheets, or network requests.
- Gameplay: the slider is the only input that drives the ride.

## Run it

There is nothing to install. Open the page in a modern browser:

```bash
open pelican_bike.html        # macOS
# xdg-open pelican_bike.html  # Linux
# start pelican_bike.html     # Windows
```

To record a deterministic ride (needs Node.js and a Chromium headless shell
whose path is set at the top of `record3.js`):

```bash
node record3.js 720 frames3 30
```

`frames*/` is ignored by Git; keep recorded videos out of pull requests.

## Checks

There is no test suite or linter. Before opening a pull request, load the page
and walk this list:

- [ ] Each stage looks right: `cruising`, `brisk`, `working hard`, `ALL OUT!!`,
      `SONIC`, `LUDICROUS`; the speed readout agrees with the stage.
- [ ] Day/night (`N`) and mute (`M`) still work, and the bell (`B`) rings.
- [ ] Deep links work: `?speed=85`, `?night=1`, `?speed=100&night=1&instant=1`.
- [ ] With "reduce motion" enabled in the OS, the page draws a single static
      frame instead of looping.
- [ ] No new network requests appear in the browser devtools Network panel.

## Pull requests

- One change per pull request, with a short description of what moved and why.
- For anything visual, attach a screenshot or a few-second clip — that is the
  review.
- Keep the diff inside the existing structure; do not reformat unrelated parts
  of the file.
- Commits follow Conventional Commits (`fix: ...`, `feat: ...`, `docs: ...`).

## Issues

State what you saw and what you expected, plus your browser and OS. A screenshot
or a console error helps more than a paragraph. Feature requests are welcome but
will be judged against the constraint above: it has to make the ride better
without adding machinery.

## License

By contributing you agree that your contribution is licensed under
[AGPL-3.0](LICENSE.md), the license of this repository.

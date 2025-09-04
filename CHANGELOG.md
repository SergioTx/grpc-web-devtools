# CHANGELOG

## 2.4.0 - 2025.09.04

- feat: allow http localhost, thanks to [PeterCardenas](https://github.com/PeterCardenas).

## 2.3.0 - 2023.11.07

- feat: add timestamp to the list.
- feat: add exclude filter.
- feat: add theme selector.

## 2.2.1 - 2023.10.09

- refactor: change to function components and set more CSS variables.

## 2.2.0 - 2023.10.04

- fix: row selection selecting wrong data.
- feat: add filter by content. This filter searches in a stringified JSON.
- perf: store again the filtered list to avoid calculations.

## 2.1.0 - 2023.10.03

- feat: add stop/resume button.
- feat: add service name if the method is `url.XxxxService/path` on the list.
- fix: fix filters crashing.
- chore: remove `fuse.js` library.

## 2.0.1 - 2023.07.28

- Remove log.

## 2.0.0 - 2023.07.27

- First version with `removeListener` fixed and hooks for `onMetadata` and `onEnd`.

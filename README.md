# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

## GiveNear — Login & Authentication

The platform now has a complete client-side auth flow for both roles:

- **Donors** (`donor@givenear.org` / `donor123` demo) can post donation listings for doorstep pickup.
- **NGOs** (`ngo@givenear.org` / `ngo123` demo) can claim donation listings and publish verified NGO requirements.

### Features

- Login + Register modes with **Donor / NGO** role selection.
- Session persisted in `localStorage` (`givenear_user_session_v1`) and restored on reload.
- Password validation (min 6 chars), email format check, phone validation.
- NGO accounts can register with organization name, Darpan/registration ID, field coordinator and phone.
- Role-based actions: posting donations requires a Donor session, claiming listings / posting NGO needs requires an NGO session (guests are prompted to login).
- Claim modal and donation form prefill details from the logged-in session.

> Note: This is a front-end demo auth layer (localStorage + demo-grade hashing). Swap `services/auth.ts` calls for a real backend API when integrating one.

## Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.

# BU-LabTrack

A web app for managing university labs at **Badya University**: browse lab rooms, reserve equipment, share tools between students, follow research labs, and handle approvals and maintenance. Built as a student team project.

> **This repository contains the React frontend only.** It expects a REST API at `http://localhost:8080/api` (see [Backend](#backend)).

## Roles

The app has four kinds of users, each with their own registration and dashboard:

| Role | What they can do |
|---|---|
| **Student** | View labs and equipment, reserve equipment, list and borrow shared tools, browse research labs |
| **Instructor** | Review reservations (approve / reject), add equipment, update equipment status |
| **Technician** | See and handle maintenance requests assigned to them |
| **Doctor** | View the labs overview dashboard |

## Features

- Sign up and log in per role, JWT stored client-side and sent with every request
- Lab rooms and equipment listing, with availability checks before booking
- Equipment reservations with instructor approval workflow
- Student-to-student equipment sharing
- Research lab section
- Technician maintenance requests
- Dark mode

## Tech stack

- React 18 + TypeScript
- Vite 6
- Tailwind CSS
- shadcn/ui components on top of Radix UI
- Recharts, React Hook Form, Sonner (toasts), Lucide icons

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build in /build
```

## Backend

The frontend calls these resources on `http://localhost:8080/api` (change `API_BASE_URL` in `src/services/api.ts` if yours differs):

`/auth/register*`, `/auth/login`, `/labs`, `/equipment`, `/reservations`, `/shared-tools`, `/research`, `/maintenance-requests`

The backend is a separate service and is not included here.

## Project structure

```
src/
├── components/      # screens per role + shared UI (ui/ = shadcn components)
├── services/api.ts  # typed API client and auth token helpers
├── App.tsx          # view switching, auth state, dark mode context
└── styles/          # global styles
```

## Credits

UI scaffolding was generated from a Figma design with Figma Make, then wired to the API. Components from [shadcn/ui](https://ui.shadcn.com/) (MIT) and photos from [Unsplash](https://unsplash.com). See `src/Attributions.md`.

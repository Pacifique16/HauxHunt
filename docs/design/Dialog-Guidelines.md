# HauxHunt Dialog Guidelines

Use these rules whenever creating or updating a dialog in HauxHunt.

## Global dialog treatment

- Dialog surfaces use a `1.5rem` corner radius.
- The radius is defined globally in `src/app/globals.css`:

```css
[role="dialog"] {
  border-radius: 1.5rem;
}
```

- Put `role="dialog"` and `aria-modal="true"` on the visible dialog surface, not on the full-screen overlay.
- The overlay covers the full viewport, has sharp corners, and uses a translucent dark background.
- Dialog surfaces use a white background, `overflow-hidden` or `overflow-x-hidden`, and a soft elevated shadow.
- Full-screen photo previews are exempt and remain square.

## Standard form dialog

Use this structure for editing or adding information:

1. Header with the title on the left and close button on the right.
2. Form fields in the content area.
3. Clear vertical space between the last field and the actions.
4. All action buttons aligned to the right.

```tsx
<div className="fixed inset-0 flex items-center justify-center bg-black/50 p-4">
  <section
    role="dialog"
    aria-modal="true"
    aria-labelledby="dialog-title"
    className="w-full max-w-lg overflow-hidden bg-white p-6 shadow-2xl sm:p-8"
  >
    <header className="flex items-center justify-between gap-4">
      <h2 id="dialog-title">Dialog title</h2>
      <button type="button" aria-label="Close dialog">...</button>
    </header>

    <div className="mt-6">...</div>

    <div className="mt-8 flex justify-end gap-3">
      ...actions
    </div>
  </section>
</div>
```

## Dialog with an illustration

Confirmation dialogs that use an illustration have two vertically separated parts:

1. A full-width, softly tinted image panel at the top.
2. A content panel below containing the title, explanation, and actions.

Do not place the image beside the content. The close button sits in the top-right corner of the image panel.

Recommended sizing:

- Dialog: `max-w-xl`
- Image panel: at least `min-h-48`
- Illustration: approximately `h-40`, with `object-contain`
- Content padding: `p-6 sm:p-8`

## Buttons

- Every dialog action group is right-aligned with `justify-end`.
- Keep a consistent `gap-3` between actions.
- Use rounded pill buttons.
- For destructive confirmations, place the destructive action on the left and Cancel on the right.
- Cancel is the filled black primary action for destructive confirmations.
- The destructive action is a secondary outlined button unless a flow explicitly requires stronger danger emphasis.
- Choice rows that form the dialog content, such as payment-method choices, can remain full width; they are not dialog actions.

## Behavior and accessibility

- Close the dialog through its close button, Cancel action, or a click on the overlay when appropriate.
- Do not close when clicking inside the dialog surface.
- Give the dialog an accessible title using `aria-labelledby` or `aria-label`.
- Give icon-only close buttons an accessible label.
- Keep keyboard focus indicators intentional and consistent with the project controls.
- Disable submit actions until required fields are valid.
- Show concise toast feedback after a successful action.

## Reference implementations

- Renter account dialogs: `src/app/renter-dashboard/account/page.tsx`
- Application confirmation dialog: `src/app/renter-dashboard/applications/page.tsx`
- Viewing confirmation dialogs: `src/app/renter-dashboard/visits/page.tsx`
- Global dialog styling: `src/app/globals.css`

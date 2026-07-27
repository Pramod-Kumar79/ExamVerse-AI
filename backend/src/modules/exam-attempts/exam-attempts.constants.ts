// Grace period after an exam's scheduled end time during which a student
// can still START a fresh attempt (accounts for clock skew / a student
// clicking "start" right as the window closes). This does NOT extend how
// long an already-in-progress attempt can run — that's governed by the
// exam's own duration once started.
export const EXAM_WINDOW_BUFFER_MINUTES = 10;

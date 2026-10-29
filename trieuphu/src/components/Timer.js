export const Timer = ({ seconds }) => (
  <div
    className={`game-timer ${seconds <= 10 ? 'timer-warning' : ''}`}
    aria-live="polite"
  >
    Còn {seconds} giây
  </div>
);

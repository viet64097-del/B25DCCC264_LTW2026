export const Lifelines = ({ used, canUse, onUseFifty, onUseAudience, onStop }) => (
  <div className="lifelines">
    <button
      className="button"
      type="button"
      onClick={onUseFifty}
      disabled={!canUse || used.fifty}
    >
      50:50
    </button>
    <button
      className="button"
      type="button"
      onClick={onUseAudience}
      disabled={!canUse || used.audience}
    >
      Hỏi khán giả
    </button>
    <button
      className="button"
      type="button"
      onClick={onStop}
      disabled={!canUse}
    >
      Dừng cuộc chơi
    </button>
  </div>
);

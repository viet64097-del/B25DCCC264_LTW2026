import { LETTERS } from '../data';

export const AudienceChart = ({ percentages }) => (
  <section className="audience-chart" aria-label="Kết quả hỏi khán giả">
    <h2>Kết quả bình chọn</h2>
    {percentages.map((percentage, index) => (
      <div className="audience-row" key={LETTERS[index]}>
        <span className="audience-label">
          {LETTERS[index]}: {percentage}%
        </span>
        <div className="audience-track">
          <div
            className="audience-bar"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    ))}
  </section>
);

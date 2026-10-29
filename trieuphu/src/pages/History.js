import { formatMoney } from '../data';

export const History = ({ history, setHistory }) => {
  const sortedHistory = [...history].sort(
    (first, second) => second.prize - first.prize,
  );
  const totalPrize = history.reduce((total, record) => total + record.prize, 0);
  const highestPrize = history.reduce(
    (highest, record) => Math.max(highest, record.prize),
    0,
  );

  return (
    <section>
      <h1>Lịch sử các lượt chơi</h1>

      <div className="history-summary">
        <p>Số lượt chơi: {history.length}</p>
        <p>Tiền thưởng cao nhất: {formatMoney(highestPrize)}</p>
        <p>Tổng tiền thưởng: {formatMoney(totalPrize)}</p>
      </div>

      {history.length === 0 ? (
        <p>Chưa có lượt chơi nào.</p>
      ) : (
        <>
          <div className="table-container">
            <table className="question-table history-table">
              <thead>
                <tr>
                  <th scope="col">Người chơi</th>
                  <th scope="col">Số câu đúng</th>
                  <th scope="col">Tiền thưởng</th>
                  <th scope="col">Thời gian</th>
                </tr>
              </thead>
              <tbody>
                {sortedHistory.map((record) => (
                  <tr key={record.id}>
                    <td>{record.name}</td>
                    <td>{record.correctCount}</td>
                    <td>{formatMoney(record.prize)}</td>
                    <td>{record.playedAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            className="button clear-history-button"
            type="button"
            onClick={() => setHistory([])}
          >
            Xóa lịch sử
          </button>
        </>
      )}
    </section>
  );
};

import { formatMoney } from '../data';

export const Home = ({ playerName, setPlayerName, onStart, history }) => {
  const bestResult = [...history].sort((first, second) => second.prize - first.prize)[0];

  return (
    <section className="home-page">
    <p className="section-label">Trò chơi kiến thức · 15 câu hỏi</p>
    <h1>Ai là triệu phú</h1>
    <p className="intro-text">
      Trả lời 15 câu hỏi về HTML, CSS, JavaScript và React. Mỗi câu có 30 giây.
      Câu trả lời đúng sẽ đưa bạn lên bậc tiền thưởng tiếp theo.
    </p>

    <div className="rules-box">
      <h2>Luật chơi</h2>
      <ul>
        <li>Trả lời đúng cả 15 câu để nhận 250.000.000 đ.</li>
        <li>Mỗi câu hỏi có 30 giây. Hết giờ được tính là trả lời sai.</li>
        <li>Câu 5, 10 và 15 là các mốc an toàn.</li>
        <li>Trả lời sai, tiền thưởng tính theo mốc an toàn cao nhất đã qua.</li>
      </ul>
    </div>

    <form
      className="start-form"
      onSubmit={(event) => {
        event.preventDefault();
        if (playerName.trim()) onStart();
      }}
    >
      <label htmlFor="player-name">Tên người chơi</label>
      <input
        id="player-name"
        type="text"
        value={playerName}
        onChange={(event) => setPlayerName(event.target.value)}
        placeholder="Nhập tên của bạn"
      />
      <button className="button primary-button" type="submit" disabled={!playerName.trim()}>
        Bắt đầu
      </button>
    </form>

    {bestResult && (
      <p className="home-record">
        Kỷ lục: <strong>{formatMoney(bestResult.prize)} – {bestResult.name}</strong>
      </p>
    )}
  </section>
  );
};

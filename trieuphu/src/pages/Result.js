import { Link, Navigate, useLocation } from 'react-router-dom';
import { formatMoney } from '../data';

const RESULT_TITLES = {
  won: 'Chúc mừng! Bạn đã trở thành triệu phú',
  wrong: 'Rất tiếc, bạn đã trả lời sai',
  timeout: 'Hết giờ!',
  stop: 'Bạn đã dừng cuộc chơi',
};

export const Result = () => {
  const location = useLocation();
  const result = location.state;

  if (!result) {
    return <Navigate to="/" replace />;
  }

  return (
    <section className="result-page">
      <p className="section-label">Kết quả lượt chơi</p>
      <h1>{RESULT_TITLES[result.reason]}</h1>
      <div className="result-details">
        <p>
          Người chơi: <strong>{result.name}</strong>
        </p>
        <p>
          Số câu trả lời đúng: <strong>{result.correctCount}</strong>
        </p>
        <p>
          Tiền thưởng: <strong>{formatMoney(result.prize)}</strong>
        </p>
      </div>
      <div className="result-actions">
        <Link className="button primary-button" to="/play">
          Chơi lại
        </Link>
        <Link className="button" to="/">
          Về trang chủ
        </Link>
      </div>
    </section>
  );
};

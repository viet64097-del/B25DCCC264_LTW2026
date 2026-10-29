import { Link } from 'react-router-dom';

export const NotFound = () => (
  <section>
    <h1>404 - Không tìm thấy trang</h1>
    <p>Địa chỉ bạn mở không tồn tại.</p>
    <Link className="button" to="/">
      Về trang chủ
    </Link>
  </section>
);

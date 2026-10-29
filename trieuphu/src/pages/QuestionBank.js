import { useState } from 'react';
import { Link } from 'react-router-dom';
import { LEVELS } from '../data';

export const QuestionBank = ({ questions, loading, error }) => {
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [query, setQuery] = useState('');

  const handleQueryShift = (event) => {
    setQuery(event.target.value);
  };

  if (loading) {
    return <p>Đang tải câu hỏi...</p>;
  }

  if (error) {
    return <p role="alert">Không tải được câu hỏi.</p>;
  }

  const filteredQuestions = questions.filter((question) => {
    const matchesLevel =
      selectedLevel === 'all' || question.level === Number(selectedLevel);
    const matchesQuery = question.question
      .toLocaleLowerCase('vi')
      .includes(query.trim().toLocaleLowerCase('vi'));

    return matchesLevel && matchesQuery;
  });

  return (
    <section>
      <h1>Ngân hàng câu hỏi</h1>

      <div className="question-filters">
        <label>
          Mức độ
          <select
            value={selectedLevel}
            onChange={(event) => setSelectedLevel(event.target.value)}
          >
            <option value="all">Tất cả</option>
            {Object.entries(LEVELS).map(([level, label]) => (
              <option key={level} value={level}>
                {label}
              </option>
            ))}
          </select>
        </label>

        <label className="search-field">
          Tìm kiếm theo nội dung câu hỏi
          <input
            type="search"
            value={query}
            onChange={handleQueryShift}
            placeholder="Nhập nội dung cần tìm"
          />
        </label>
      </div>

      <p className="question-count">Có {filteredQuestions.length} câu hỏi</p>

      <div className="table-container">
        <table className="question-table">
          <thead>
            <tr>
              <th scope="col">STT</th>
              <th scope="col">Mức độ</th>
              <th scope="col">Câu hỏi</th>
            </tr>
          </thead>
          <tbody>
            {filteredQuestions.map((question, index) => (
              <tr key={question.id}>
                <td>{index + 1}</td>
                <td>{LEVELS[question.level]}</td>
                <td>
                  <Link to={`/questions/${question.id}`}>
                    {question.question}
                  </Link>
                </td>
              </tr>
            ))}
            {filteredQuestions.length === 0 && (
              <tr>
                <td colSpan="3">Không có câu hỏi phù hợp.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

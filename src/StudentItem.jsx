const StudentItem = ({ student: { id, name, score, class: className }, onDelete }) => {
  const isPassing = score >= 5;

  return (
    <tr>
      <td>
        <div className="student-cell">
          <span className="avatar" aria-hidden="true">{name.charAt(0).toUpperCase()}</span>
          <span className="student-name">{name}</span>
        </div>
      </td>
      <td><span className="class-tag">{className}</span></td>
      <td><strong className="score-value">{score.toFixed(1)}</strong></td>
      <td>
        <span className={`status-badge ${isPassing ? 'status-pass' : 'status-fail'}`}>
          {isPassing ? 'Đạt' : 'Chưa đạt'}
        </span>
      </td>
      <td className="action-cell">
        <button className="delete-button" type="button" onClick={() => onDelete(id)} aria-label={`Xóa ${name}`}>
          Xóa
        </button>
      </td>
    </tr>
  );
};

export default StudentItem;

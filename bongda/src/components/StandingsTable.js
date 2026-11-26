import { formatDiff } from '../data';

function StandingsTable({ standings }) {
  return (
    <section className="section standings-section" id="standings" aria-labelledby="standings-title">
      <div className="section-heading section-heading--compact">
        <div>
          <h2 id="standings-title">Bảng xếp hạng</h2>
          <p>Xếp theo điểm, hiệu số, bàn thắng và tên đội.</p>
        </div>
      </div>
      <div className="table-scroll standings-scroll">
        <table className="standings-table">
          <caption className="visually-hidden">Bảng xếp hạng sáu đội bóng</caption>
          <thead>
            <tr>
              <th scope="col">Hạng</th><th scope="col">Đội</th><th scope="col">Trận</th><th scope="col">Thắng</th><th scope="col">Hòa</th><th scope="col">Thua</th><th scope="col">BT</th><th scope="col">BB</th><th scope="col">HS</th><th scope="col">Điểm</th>
            </tr>
          </thead>
          <tbody>
            {standings.map((team, index) => (
              <tr className={index === standings.length - 1 ? 'standing-row standing-row--last' : 'standing-row'} key={team.id}>
                <td data-label="Hạng">{index + 1}</td>
                <th scope="row" data-label="Đội">{team.name}</th>
                <td data-label="Trận">{team.played}</td>
                <td data-label="Thắng">{team.won}</td>
                <td data-label="Hòa">{team.drawn}</td>
                <td data-label="Thua">{team.lost}</td>
                <td data-label="Bàn thắng">{team.gf}</td>
                <td data-label="Bàn thua">{team.ga}</td>
                <td data-label="Hiệu số">{formatDiff(team.diff)}</td>
                <td className="standing-points" data-label="Điểm">{team.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default StandingsTable;

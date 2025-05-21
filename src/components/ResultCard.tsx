import React from 'react';

interface ResultCardProps {
  score: number;
  total: number;
  details: { word: string; color: string; user: string; correct: boolean }[];
}

export default function ResultCard({ score, total, details }: ResultCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-xl mx-auto mt-8">
      <h2 className="text-3xl font-bold text-center mb-4 text-green-600">Your Score: {score} / {total}</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse" role="table" aria-label="Results summary table">
          <thead>
            <tr>
              <th className="py-2 px-2" scope="col">Word</th>
              <th className="py-2 px-2" scope="col">Color</th>
              <th className="py-2 px-2" scope="col">You Said</th>
              <th className="py-2 px-2" scope="col">Result</th>
            </tr>
          </thead>
          <tbody>
            {details.map((d, i) => (
              <tr key={i} className="border-t" role="row">
                <td className="py-1 px-2 font-bold" role="cell">{d.word}</td>
                <td className="py-1 px-2" style={{ color: d.color }} role="cell">{d.color}</td>
                <td className="py-1 px-2" role="cell">{d.user}</td>
                <td className="py-1 px-2" role="cell">
                  {d.correct ? (
                    <span className="text-green-500 font-bold" aria-label="Correct">✔</span>
                  ) : (
                    <span className="text-red-500 font-bold" aria-label="Incorrect">✘</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 
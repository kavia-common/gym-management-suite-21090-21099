import React from "react";
import Shell from "../components/layout/Shell";
import Card from "../components/common/Card";
import Table from "../components/common/Table";

export default function Trainers() {
  const columns = [
    { header: "Name", accessor: "name" },
    { header: "Specialty", accessor: "specialty" },
    { header: "Rating", accessor: "rating" },
  ];
  const data = [
    { id: 1, name: "Sam Carter", specialty: "HIIT", rating: "4.7" },
    { id: 2, name: "Mia Wong", specialty: "Yoga", rating: "4.9" },
  ];
  return (
    <Shell>
      <div className="container" style={{ padding: 16 }}>
        <Card title="Trainers">
          <Table columns={columns} data={data} />
        </Card>
      </div>
    </Shell>
  );
}

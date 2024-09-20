import React, { useState } from "react";
import PageTitle from "../../../components/PageTitle";
import { message, Table, Modal } from "antd";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";
import { getAllReports } from "../../../apicalls/reports";
import { useEffect } from "react";
import moment from "moment";

function AdminReports() {
  const [reportsData, setReportsData] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [isReviewModalVisible, setIsReviewModalVisible] = useState(false);
  const dispatch = useDispatch();
  const [filters, setFilters] = useState({
    examName: "",
    userName: "",
  });

  const columns = [
    {
      title: "Exam Name",
      dataIndex: "examName",
      render: (text, record) => <>{record.exam.name}</>,
    },
    {
      title: "User Name",
      dataIndex: "userName",
      render: (text, record) => <>{record.user.name}</>,
    },
    {
      title: "Date",
      dataIndex: "date",
      render: (text, record) => (
        <>{moment(record.createdAt).format("DD-MM-YYYY hh:mm:ss")}</>
      ),
    },
    {
      title: "Total Marks",
      dataIndex: "totalQuestions",
      render: (text, record) => <>{record.exam.totalMarks}</>,
    },
    {
      title: "Passing Marks",
      dataIndex: "correctAnswers",
      render: (text, record) => <>{record.exam.passingMarks}</>,
    },
    {
      title: "Obtained Marks",
      dataIndex: "correctAnswers",
      render: (text, record) => <>{record.result.correctAnswers.length}</>,
    },
    {
      title: "Verdict",
      dataIndex: "verdict",
      render: (text, record) => <>{record.result.verdict}</>,
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text, record) => (
        <button
          className="primary-outlined-btn"
          onClick={() => {
            setSelectedReport(record);
            setIsReviewModalVisible(true);
          }}
        >
          Review
        </button>
      ),
    },
  ];

  const getData = async (tempFilters) => {
    try {
      dispatch(ShowLoading());
      const response = await getAllReports(tempFilters);
      if (response.success) {
        setReportsData(response.data);
      } else {
        message.error(response.message);
      }
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  useEffect(() => {
    getData(filters);
  }, []);

  return (
    <div>
      <PageTitle title="Reports" />
      <div className="divider"></div>
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Exam"
          value={filters.examName}
          onChange={(e) => setFilters({ ...filters, examName: e.target.value })}
        />
        <input
          type="text"
          placeholder="User"
          value={filters.userName}
          onChange={(e) => setFilters({ ...filters, userName: e.target.value })}
        />
        <button
          className="primary-outlined-btn"
          onClick={() => {
            setFilters({
              examName: "",
              userName: "",
            });
            getData({
              examName: "",
              userName: "",
            });
          }}
        >
          Clear
        </button>
        <button className="primary-contained-btn" onClick={() => getData(filters)}>
          Search
        </button>
      </div>
      <Table columns={columns} dataSource={reportsData} className="mt-2" />

      {/* Review Modal */}
      <Modal
        title="Review Report"
        visible={isReviewModalVisible}
        onCancel={() => setIsReviewModalVisible(false)}
        footer={null}
      >
        {selectedReport && (
          <div className="flex flex-col gap-2 ">
            {selectedReport.result.questions.map((question, index) => {
              const isCorrect =
                question.correctOption === selectedReport.result.selectedOptions[index];
              return (
                <div
                  key={index}
                  className={`p-2 ${isCorrect ? "bg-green-500" : "bg-red-400"}`}
                >
                  <h1 className="text-xl">
                    {index + 1}: {question.name}
                  </h1>
                  <h2 className="text-md">
                    Selected Answer: {selectedReport.result.selectedOptions[index]} -{" "}
                    {question.options[selectedReport.result.selectedOptions[index]]}
                  </h2>
                  <h2 className="text-md">
                    Correct Answer: {question.correctOption} -{" "}
                    {question.options[question.correctOption]}
                  </h2>
                </div>
              );
            })}
          </div>
        )}
      </Modal>
    </div>
  );
}

export default AdminReports;

import React, { useState, useEffect } from "react";
import PageTitle from "../../../components/PageTitle";
import { message, Table, Select, Button } from "antd";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";
import { getAllReports } from "../../../apicalls/reports";
import moment from "moment";
import { getUserInfo } from "../../../apicalls/users";
import { getAllExams } from "../../../apicalls/exams";

const { Option } = Select;

function Report() {
    const [reportsData, setReportsData] = React.useState([]);
  const [allowedTests, setAllowedTests] = useState([]);
  const [exams, setExams] = useState([]);
  const dispatch = useDispatch();
  const [filters, setFilters] = React.useState({
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
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userInfo = await getUserInfo();
        if (userInfo.success) {
          setAllowedTests(userInfo.data.allowedTests);
        } else {
          message.error("Failed to fetch user info.");
        }

        const allExams = await getAllExams();
        if (allExams.success) {
          setExams(allExams.data);
        } else {
          message.error("Failed to fetch exams.");
        }
      } catch (error) {
        message.error("Error fetching data.");
      }
    };
    fetchData();
  }, []);

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
  }, [filters]);

  return (
    <div>
      <PageTitle title="Reports" />
      <div className="divider"></div>
      <div className="flex gap-2">
      <Select
  placeholder="Select an exam"
  value={filters.examName}
  onChange={(value) => setFilters({ ...filters, examName: value })}
  style={{ width: 300 }}
>
  {allowedTests.map((testId) => {
    const exam = exams.find((e) => e._id === testId);
    return (
      <Option key={testId} value={testId}>
        {exam ? exam.name : "Unknown Test"}
      </Option>
    );
  })}
</Select>

        <Button className="primary-outlined-btn" onClick={() => {
          setFilters({ examName: "", userName: "" });
          getData({ examName: "", userName: "" });
        }}>
          Clear
        </Button>
        <button className="primary-contained-btn" onClick={() => getData(filters)}>
          Search
        </button>
      </div>
      <Table columns={columns} dataSource={reportsData} className="mt-2" />
    </div>
  );
}

export default Report;

import React, { useEffect, useState } from "react";
import { Form, message, Modal, Button } from "antd";
import { getUserInfo } from "../../../apicalls/users";
import { getAllExams, editExamById } from "../../../apicalls/exams";
import { useNavigate } from "react-router-dom";

// Inside your component


const Index = () => {
  const [allowedTests, setAllowedTests] = useState([]);
  const [exams, setExams] = useState([]);
  const [showEditExamModal, setShowEditExamModal] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      // Fetch user info and exams
      const userInfo = await getUserInfo();
      if (userInfo.success) {
        setAllowedTests(userInfo.data.allowedTests);
      }
      const allExams = await getAllExams();
      if (allExams.success) {
        setExams(allExams.data);
      }
    };
    fetchData();
  }, []);

  const handleEdit = (exam) => {
    setSelectedExam(exam);
    setShowEditExamModal(true);
  };

  const handleSave = async (values) => {
    try {
      const response = await editExamById({
        ...selectedExam,
        name: values.name,
        duration: values.duration,
        category: values.category,
        totalMarks: values.totalMarks,
        passingMarks: values.passingMarks,
      });

      if (response.success) {
        message.success(response.message);
        setShowEditExamModal(false);
        // Optionally refresh the list of exams
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  return (
    <div>
      <h1>Manage Tests</h1>
      <ul>
        {allowedTests.map((testId) => {
          const exam = exams.find((e) => e._id === testId);
          return (
            <div className="flex flex-col items-start justify-start">
            <li className="pb-5 pt-5 text-xl " key={testId}>
              Test Name :       {exam ? exam.name : "Unknown Test"}
              <Button  onClick={() => navigate(`/subadmin/Managetestpage/edit/${testId}`)}  style={{ marginLeft: 10 }}>
                Edit
              </Button>
            </li>
            </div>
          );
        })}
      </ul>

      
    </div>
  );
};

export default Index;

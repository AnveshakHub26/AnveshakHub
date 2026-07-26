"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Briefcase, CheckCircle2, Star, Clock, Video, RefreshCw,
  ChevronRight, Loader2, Award, User, ShieldCheck, AlertCircle, ArrowRight, FileText, Upload
} from "lucide-react";
import Link from "next/link";
import MetricGauge from "@/components/ui/metric-gauge";
import MilestoneTimeline from "@/components/ui/milestone-timeline";
import HumanEmptyState from "@/components/ui/human-empty-state";

interface StudentDashboardData {
  student: {
    name: string;
    usn: string;
    institution: string;
    degree: string;
    semester: number;
    cgpa: number;
    verificationStatus: string;
  };
  kpis: {
    activeProjectsCount: number;
    completedTasksCount: number;
    totalTasksCount: number;
    mentorshipScore: number;
    attendanceRate: number;
    learningGoalsCompleted: number;
    totalLearningGoals: number;
  };
  assignedProject: {
    id: string;
    name: string;
    industryPartner: string;
    role: string;
    leadExpert: string;
    progress: number;
    sprintMilestone: string;
  };
  assignedTasks: Array<{
    id: string;
    title: string;
    status: string;
    priority: string;
    dueDate: string;
  }>;
  leadMentor: {
    id: string;
    name: string;
    designation: string;
    institution: string;
    lastFeedback: string;
    lastFeedbackDate: string;
  };
  upcomingCalls: Array<{
    id: string;
    title: string;
    orgName: string;
    startTime: string;
    endTime: string;
    videoLink: string;
  }>;
}

export default function StudentDashboardPage() {
  const [data, setData] = useState<StudentDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/student/dashboard");
      const json = await res.json();
      if (json.status === "success") {
        setData(json);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FBF7F0] flex items-center justify-center p-8">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 text-[#FF5A36] animate-spin" />
          <p className="text-sm font-semibold text-[#57534E]">Preparing your research workspace…</p>
        </div>
      </div>
    );
  }

  const student = data?.student || {
    name: "Aditya Kumar",
    usn: "1RV21CS014",
    institution: "RV College of Engineering",
    degree: "B.Tech Computer Science",
    semester: 6,
    cgpa: 9.2,
    verificationStatus: "VERIFIED",
  };

  const kpis = data?.kpis || {
    activeProjectsCount: 1,
    completedTasksCount: 8,
    totalTasksCount: 12,
    mentorshipScore: 9.4,
    attendanceRate: 98,
    learningGoalsCompleted: 4,
    totalLearningGoals: 5,
  };

  const assignedProject = data?.assignedProject || {
    id: "proj-101",
    name: "Autonomous Drone Flight Trajectory Optimization",
    industryPartner: "Siemens Corporate R&D",
    role: "Research Intern - Flight Control Algorithms",
    leadExpert: "Dr. S. Ramanathan (IISc Bangalore)",
    progress: 68,
    sprintMilestone: "Sprint 3: Real-time obstacle avoidance simulation testing",
  };

  const leadMentor = data?.leadMentor || {
    id: "exp-201",
    name: "Dr. S. Ramanathan",
    designation: "Professor & Department Head",
    institution: "IISc Bangalore",
    lastFeedback: "Excellent progress on the ROS2 sensor fusion node. Make sure to document edge cases before Tuesday's call.",
    lastFeedbackDate: "Yesterday at 4:30 PM",
  };

  const upcomingCalls = data?.upcomingCalls || [
    {
      id: "call-1",
      title: "Sprint 3 Technical Review & Code Demonstration",
      orgName: "Siemens R&D & IISc Lab",
      startTime: "Today, 3:00 PM",
      endTime: "4:00 PM",
      videoLink: "https://meet.anveshakhub.com/r/drone-sprint-3",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FBF7F0] text-[#57534E] font-sans pb-16 text-left">
      
      {/* Top Banner Header */}
      <div className="bg-[#EFE9DF] border-b border-[#E2DCD2] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#211F1D]">
                  Welcome back, {student.name}
                </h1>
                <span className="badge-forest text-xs font-semibold px-2.5 py-0.5 rounded-full border border-[#BBD9C8]">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  {student.verificationStatus}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#57534E] mt-1 font-semibold">
                {student.degree} • {student.institution} (Semester {student.semester} • USN: {student.usn})
              </p>
            </div>
            
            {/* Recruiter Activity Card */}
            <div className="bg-[#FFF0ED] border border-[#FFCFC4] p-3.5 rounded-xl flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-[#FF5A36] animate-ping shrink-0" />
              <p className="text-xs text-[#211F1D] font-medium">
                <strong className="text-[#FF5A36]">3 corporate leads</strong> viewed your research profile this week.
              </p>
              <Link href="/student/profile" className="btn-primary text-xs py-1.5 px-3 min-h-[36px] ml-auto shrink-0">
                Finish Profile
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">

        {/* Profile Action Banner */}
        <div className="card-flat p-5 bg-[#FFF0ED] border-[#FFCFC4] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-6 w-6 text-[#FF5A36] shrink-0" />
            <div>
              <h3 className="font-heading text-sm font-bold text-[#211F1D]">
                Profiles with an uploaded PDF resume receive 4x more internship interview invites.
              </h3>
              <p className="text-xs text-[#57534E] mt-0.5 font-medium">
                Upload your updated resume so faculty supervisors and corporate R&D leads can match you to paid projects.
              </p>
            </div>
          </div>
          <Link href="/student/profile" className="btn-primary text-xs min-h-[40px] px-4 shrink-0">
            <Upload className="h-4 w-4" /> Upload Resume
          </Link>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricGauge
            label="Active Research Internships"
            value={kpis.activeProjectsCount}
            sublabel="Siemens Drone Flight Controls"
            icon={Briefcase}
            badge="In Progress"
          />
          <MetricGauge
            label="Sprint Tasks Completed"
            value={`${kpis.completedTasksCount}/${kpis.totalTasksCount}`}
            progress={(kpis.completedTasksCount / kpis.totalTasksCount) * 100}
            sublabel="66% milestone velocity"
            icon={CheckCircle2}
          />
          <MetricGauge
            label="Faculty Mentor Rating"
            value={`${kpis.mentorshipScore}/10`}
            sublabel="Rated by Dr. S. Ramanathan"
            trend="up"
            trendValue="+0.4"
            icon={Star}
          />
          <MetricGauge
            label="Learning Goals Completed"
            value={`${kpis.learningGoalsCompleted}/${kpis.totalLearningGoals}`}
            progress={(kpis.learningGoalsCompleted / kpis.totalLearningGoals) * 100}
            progressColor="#2F6B4F"
            sublabel="Skill Badges Earned"
            icon={Award}
          />
        </div>

        {/* Main Content Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left Column: Active Project & Sprint Milestone */}
          <div className="lg:col-span-8 space-y-6">

            {/* Active Internship Banner Card */}
            <div className="card-flat p-6 rounded-3xl bg-[#FBF7F0] space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E2DCD2] pb-4">
                <div>
                  <span className="text-[11px] font-bold text-[#FF5A36] uppercase tracking-wider">
                    {assignedProject.industryPartner} • {assignedProject.role}
                  </span>
                  <h2 className="font-heading text-xl font-extrabold text-[#211F1D] mt-0.5">
                    {assignedProject.name}
                  </h2>
                </div>
                <Link
                  href={`/student/projects/${assignedProject.id}`}
                  className="btn-secondary text-xs shrink-0 inline-flex items-center gap-1.5"
                >
                  Workspace <ChevronRight className="h-4 w-4" />
                </Link>
              </div>

              {/* Progress bar */}
              <div>
                <div className="flex justify-between text-xs font-bold mb-1.5">
                  <span className="text-[#211F1D]">Overall Project Progress</span>
                  <span className="text-[#FF5A36] font-mono">{assignedProject.progress}%</span>
                </div>
                <div className="w-full bg-[#EFE9DF] rounded-full h-2.5 overflow-hidden border border-[#E2DCD2]">
                  <div
                    className="bg-[#FF5A36] h-full rounded-full transition-all duration-500"
                    style={{ width: `${assignedProject.progress}%` }}
                  />
                </div>
              </div>

              {/* Active Milestone Details */}
              <div className="p-4 rounded-2xl bg-[#EFE9DF] border border-[#E2DCD2] space-y-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#FF5A36]">
                  Current Active Milestone
                </span>
                <p className="text-sm font-bold text-[#211F1D]">
                  {assignedProject.sprintMilestone}
                </p>
                <div className="flex items-center justify-between pt-1 text-xs">
                  <span className="text-[#57534E] font-medium">Supervisor: {assignedProject.leadExpert}</span>
                  <Link href="/student/documents" className="text-[#FF5A36] font-bold hover:underline flex items-center gap-1">
                    <FileText className="h-3.5 w-3.5" /> Submit Deliverables
                  </Link>
                </div>
              </div>
            </div>

            {/* Research Milestone Timeline */}
            <div className="card-flat p-6 rounded-3xl bg-[#FBF7F0] space-y-4">
              <h3 className="font-heading text-base font-bold text-[#211F1D]">
                Project Sprint Timeline
              </h3>
              <MilestoneTimeline
                milestones={[
                  {
                    id: "m1",
                    title: "Sprint 1: Sensor Calibration & ROS2 Workspace Setup",
                    dueDate: "Completed Jun 15",
                    status: "COMPLETED",
                    description: "Configured LiDAR sensor fusion package and passed unit test suites.",
                    approvedBy: "Dr. S. Ramanathan",
                    stipendAmount: 15000,
                  },
                  {
                    id: "m2",
                    title: "Sprint 2: Obstacle Avoidance Algorithm Integration",
                    dueDate: "Completed Jul 10",
                    status: "COMPLETED",
                    description: "Implemented A* pathfinder node with dynamic obstacle costmap generation.",
                    approvedBy: "Dr. S. Ramanathan",
                    stipendAmount: 20000,
                  },
                  {
                    id: "m3",
                    title: "Sprint 3: Simulation Benchmarking in Gazebo Environment",
                    dueDate: "Jul 30, 2026",
                    status: "IN_PROGRESS",
                    description: "Execute 50 simulation runs with wind disturbance parameters and log telemetry metrics.",
                    stipendAmount: 25000,
                  },
                  {
                    id: "m4",
                    title: "Sprint 4: Final Hardware Flight Test & Paper Draft",
                    dueDate: "Aug 20, 2026",
                    status: "UPCOMING",
                    description: "Deploy algorithm onto Jetson Orin Nano payload and co-author research report.",
                    stipendAmount: 30000,
                  },
                ]}
              />
            </div>

          </div>

          {/* Right Column: Mentor Card & Upcoming Calls */}
          <div className="lg:col-span-4 space-y-6">

            {/* Faculty Mentor Card */}
            <div className="card-flat p-6 rounded-3xl bg-[#FBF7F0] space-y-4">
              <h3 className="font-heading text-base font-bold text-[#211F1D] border-b border-[#E2DCD2] pb-3">
                Assigned PhD Supervisor
              </h3>
              <div className="flex items-start gap-3">
                <div className="h-12 w-12 rounded-2xl bg-[#FF5A36] text-white font-extrabold flex items-center justify-center text-lg shrink-0">
                  SR
                </div>
                <div>
                  <h4 className="font-heading text-sm font-bold text-[#211F1D]">
                    {leadMentor.name}
                  </h4>
                  <p className="text-xs text-[#57534E] font-medium">{leadMentor.designation}</p>
                  <p className="text-[11px] text-[#78716A] font-semibold">{leadMentor.institution}</p>
                </div>
              </div>

              {/* Feedback Quote */}
              <div className="p-4 rounded-2xl bg-[#EFE9DF] border border-[#E2DCD2] space-y-1.5">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#FF5A36]">
                  Latest Supervisor Note ({leadMentor.lastFeedbackDate})
                </span>
                <p className="text-xs text-[#211F1D] italic font-medium leading-relaxed">
                  "{leadMentor.lastFeedback}"
                </p>
              </div>

              <Link
                href="/student/meetings"
                className="btn-secondary w-full justify-center text-xs"
              >
                Schedule 1-on-1 Mentorship Session
              </Link>
            </div>

            {/* Upcoming Video Meetings */}
            <div className="card-flat p-6 rounded-3xl bg-[#FBF7F0] space-y-4">
              <div className="flex items-center justify-between border-b border-[#E2DCD2] pb-3">
                <h3 className="font-heading text-base font-bold text-[#211F1D]">
                  Upcoming Calls
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FFF0ED] text-[#FF5A36] border border-[#FFCFC4]">
                  {upcomingCalls.length} Scheduled
                </span>
              </div>

              {upcomingCalls.map((call) => (
                <div key={call.id} className="p-4 rounded-2xl bg-[#EFE9DF] border border-[#E2DCD2] space-y-3">
                  <div>
                    <span className="text-[10px] font-bold text-[#FF5A36] uppercase">{call.orgName}</span>
                    <h4 className="font-heading text-xs font-bold text-[#211F1D] mt-0.5">{call.title}</h4>
                    <p className="text-[11px] text-[#78716A] font-semibold flex items-center gap-1 mt-1">
                      <Clock className="h-3 w-3 text-[#FF5A36]" /> {call.startTime} ({call.endTime})
                    </p>
                  </div>

                  <a
                    href={call.videoLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary w-full justify-center text-xs py-2"
                  >
                    <Video className="h-3.5 w-3.5" /> Join Video Call
                  </a>
                </div>
              ))}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

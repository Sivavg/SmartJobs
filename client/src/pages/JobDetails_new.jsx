import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import ApplyModal from '../components/ApplyModal';
import { FaMapMarkerAlt, FaBriefcase, FaMoneyBillWave, FaBuilding, FaGlobe, FaClock, FaUsers, FaArrowLeft, FaBookmark, FaShare } from 'react-icons/fa';
import JobCard from '../components/JobCard';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

const JobDetails = () => {
    const { id } = useParams();
    const [job, setJob] = useState(null);
    const [relatedJobs, setRelatedJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [savingJob, setSavingJob] = useState(false);
    const [applicationStatus, setApplicationStatus] = useState(null);
    const [hasApplied, setHasApplied] = useState(false);
    const { user } = useSelector((state) => state.auth);

    // Function to check application status
    const checkApplicationStatus = async () => {
        if (user && user.role === 'candidate') {
            try {


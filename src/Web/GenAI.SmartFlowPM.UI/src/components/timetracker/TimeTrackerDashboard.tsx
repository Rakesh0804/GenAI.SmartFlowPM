'use client';

import React, { useState, useEffect } from 'react';
import { timeTrackerService } from '../../services/timetracker.service';
import { userService } from '../../services/user.service';
import { projectService } from '../../services/project.service';
import { taskService } from '../../services/task.service';
import { 
  ActiveTrackingSessionDto, 
  TimeEntryDto, 
  TimeCategoryDto, 
  ProjectDto, 
  TaskDto,
  UserDto,
  StartTrackingDto,
  StopTrackingDto,
  TrackingStatus,
  TimeEntryType,
  BillableStatus
} from '@/types/api.types';
import CustomSelect from '@/components/common/CustomSelect';
import { 
  Play, 
  Pause, 
  Square, 
  Clock, 
  Calendar, 
  BarChart3, 
  CirclePlus,
  Edit,
  Trash2,
  Filter,
  Search,
  RefreshCw,
  X,
  FolderOpen,
  CheckSquare,
  FileText,
  Info
} from 'lucide-react';
import { useToast } from '@/contexts/ToastContext';
import LoadingSpinner from '@/components/common/LoadingSpinner';

interface TimeTrackerDashboardProps {
  userId: string;
}

const TimeTrackerDashboard: React.FC<TimeTrackerDashboardProps> = ({ userId }) => {
  const [activeSession, setActiveSession] = useState<ActiveTrackingSessionDto | null>(null);
  const [recentEntries, setRecentEntries] = useState<TimeEntryDto[]>([]);
  const [timeCategories, setTimeCategories] = useState<TimeCategoryDto[]>([]);
  const [projects, setProjects] = useState<ProjectDto[]>([]);
  const [tasks, setTasks] = useState<TaskDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showStartModal, setShowStartModal] = useState(false);
  const [isLoadingSession, setIsLoadingSession] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [startTrackingData, setStartTrackingData] = useState<StartTrackingDto>({
    timeCategoryId: '',
    projectId: undefined,
    taskId: undefined,
    description: ''
  });

  const { success, error: showError } = useToast();

  const loadTasks = async (projectId: string) => {
    try {
      const taskResponse = await taskService.getTasks(1, 100, { 
        projectId: projectId,
        assignedUserId: userId 
      });
      setTasks(taskResponse.items || []);
    } catch (err) {
      console.error('Failed to load tasks:', err);
      showError('Failed to load tasks');
      setTasks([]);
    }
  };

  useEffect(() => {
    if (userId && !hasInitialized) {
      loadInitialData();
    }
  }, [userId, hasInitialized]);

  // Timer effect for active session
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    // Only run timer if session is truly active (isActive: true)
    if (activeSession && activeSession.isActive) {
      interval = setInterval(() => {
        const now = new Date();
        const start = new Date(activeSession.startTime);
        const elapsedMs = now.getTime() - start.getTime();
        const elapsedMinutes = Math.floor(elapsedMs / 1000 / 60);
        const newElapsed = elapsedMinutes - activeSession.pausedTime;
        setElapsedTime(newElapsed);
      }, 1000);
    }
    // If session is paused, don't run timer but keep showing the current elapsed time

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [activeSession]);

  // Periodic check for active session changes (every 30 seconds)
  useEffect(() => {
    let periodicCheck: NodeJS.Timeout;
    
    if (hasInitialized && !loading) {
      periodicCheck = setInterval(() => {
        // Only check if we're not currently loading and user is not actively tracking
        // And only if we don't have a paused session (to avoid clearing paused sessions)
        if (!isLoadingSession && !trackingLoading && (!activeSession || activeSession.isActive)) {
          loadActiveSession();
        }
      }, 30000); // Check every 30 seconds
    }

    return () => {
      if (periodicCheck) {
        clearInterval(periodicCheck);
      }
    };
  }, [hasInitialized, loading, isLoadingSession, trackingLoading, activeSession]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      
      // Load static data first
      const [entriesData, categoriesData, projectsData] = await Promise.all([
        timeTrackerService.getTimeEntriesByUser(userId),
        timeTrackerService.getActiveTimeCategories(),
        projectService.getProjects(1, 10) // Get first 10 projects
      ]);

      setRecentEntries(entriesData.slice(0, 10)); // Show last 10 entries
      setTimeCategories(categoriesData);
      
      // Handle different project response formats
      let projectList: ProjectDto[] = [];
      if (Array.isArray(projectsData)) {
        projectList = projectsData;
      } else if (projectsData && typeof projectsData === 'object' && 'items' in projectsData) {
        // Handle paginated response
        projectList = (projectsData as any).items || [];
      } else {
        console.warn('Unexpected project response format:', projectsData);
        projectList = [];
      }
      
      setProjects(projectList);

      // Load active session separately with proper error handling
      await loadActiveSession();

      setHasInitialized(true);

    } catch (error) {
      console.error('Error loading time tracker data:', error);
      showError('Failed to load time tracker data');
    } finally {
      setLoading(false);
    }
  };

  const loadActiveSession = async () => {
    if (isLoadingSession) return; // Prevent multiple concurrent session calls
    
    try {
      setIsLoadingSession(true);
      const sessionData = await timeTrackerService.getActiveTrackingSession(userId);
      
      // If we get a session, update it
      if (sessionData) {
        setActiveSession(sessionData);
        const now = new Date();
        const start = new Date(sessionData.startTime);
        const elapsed = Math.floor((now.getTime() - start.getTime()) / 1000 / 60);
        setElapsedTime(elapsed - sessionData.pausedTime);
      } else {
        // If no session returned and we don't have a current session, clear everything
        // But if we have a current session that was recently paused, keep showing it
        if (!activeSession) {
          setActiveSession(null);
          setElapsedTime(0);
        }
        // If we have an activeSession, it might be paused, so don't clear it immediately
      }
    } catch (error: any) {
      console.error('Error loading active session:', error);
      showError('Failed to load active tracking session');
      // Only clear session on error if we don't have one already
      if (!activeSession) {
        setActiveSession(null);
        setElapsedTime(0);
      }
    } finally {
      setIsLoadingSession(false);
    }
  };

  const handleStartTracking = async () => {
    if (!startTrackingData.timeCategoryId) {
      showError('Please select a time category');
      return;
    }

    try {
      setTrackingLoading(true);
      
      // Check and stop any existing session first
      if (activeSession) {
        console.log('Stopping existing session before starting new one:', activeSession.id);
        try {
          const stopData: StopTrackingDto = {
            description: activeSession.description,
            createTimeEntry: true
          };
          await timeTrackerService.stopTracking(activeSession.id, stopData);
          setActiveSession(null);
          setElapsedTime(0);
        } catch (stopError) {
          console.error('Error stopping existing session:', stopError);
          // Continue with starting new session even if stop fails
        }
      }
      
      // Clean the data before sending - ensure null values for optional fields
      const cleanData: StartTrackingDto = {
        timeCategoryId: startTrackingData.timeCategoryId,
        projectId: startTrackingData.projectId || undefined,
        taskId: startTrackingData.taskId || undefined,
        description: startTrackingData.description?.trim() || ''
      };
      
      const session = await timeTrackerService.startTracking(cleanData);
      setActiveSession(session);
      setShowStartModal(false);
      setStartTrackingData({
        timeCategoryId: '',
        projectId: undefined,
        taskId: undefined,
        description: ''
      });
      success('Time tracking started');
    } catch (error: any) {
      console.error('Error starting tracking:', error);
      
      // Check if it's a backend validation error
      if (error.response?.status === 400) {
        const errorMessage = error.response?.data?.message || 'Invalid request data';
        showError(`Unable to start tracking: ${errorMessage}`);
      } else {
        showError('Failed to start tracking. Please try again.');
      }
    } finally {
      setTrackingLoading(false);
    }
  };

  const handleStopTracking = async () => {
    if (!activeSession) return;

    try {
      setTrackingLoading(true);
      const stopData: StopTrackingDto = {
        description: activeSession.description,
        createTimeEntry: true
      };
      
      await timeTrackerService.stopTracking(activeSession.id, stopData);
      setActiveSession(null);
      setElapsedTime(0);
      
      // Refresh only recent entries, not the entire data
      await refreshRecentEntries();
      success('Time tracking stopped');
    } catch (error) {
      console.error('Error stopping tracking:', error);
      showError('Failed to stop tracking');
    } finally {
      setTrackingLoading(false);
    }
  };

  const refreshRecentEntries = async () => {
    try {
      const entriesData = await timeTrackerService.getTimeEntriesByUser(userId);
      setRecentEntries(entriesData.slice(0, 10));
    } catch (error) {
      console.error('Error refreshing recent entries:', error);
      // Don't show error to user for this background refresh
    }
  };

  const handlePauseTracking = async () => {
    if (!activeSession) return;

    try {
      setTrackingLoading(true);
      const session = await timeTrackerService.pauseTracking(activeSession.id, {});
      setActiveSession(session);
      success('Time tracking paused');
    } catch (error) {
      console.error('Error pausing tracking:', error);
      showError('Failed to pause tracking');
    } finally {
      setTrackingLoading(false);
    }
  };

  const handleResumeTracking = async () => {
    if (!activeSession) return;

    try {
      setTrackingLoading(true);
      const session = await timeTrackerService.resumeTracking(activeSession.id, {});
      setActiveSession(session);
      success('Time tracking resumed');
    } catch (error) {
      console.error('Error resuming tracking:', error);
      showError('Failed to resume tracking');
    } finally {
      setTrackingLoading(false);
    }
  };

  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

  const getActualStatus = (session: any): TrackingStatus => {
    // Return the actual status from the session
    // Don't override with isActive since paused tasks should show as paused
    return session.status;
  };

  const getStatusColor = (status: TrackingStatus) => {
    switch (status) {
      case TrackingStatus.Running:
        return 'text-green-600 bg-green-100';
      case TrackingStatus.Paused:
        return 'text-yellow-600 bg-yellow-100';
      case TrackingStatus.Stopped:
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Active Timer Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Active Timer
          </h2>
          <button
            onClick={loadActiveSession}
            disabled={isLoadingSession}
            className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            title="Refresh active session"
          >
            <RefreshCw className={`w-4 h-4 ${isLoadingSession ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {activeSession ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="text-3xl font-mono font-bold text-gray-900">
                  {formatTime(elapsedTime)}
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(getActualStatus(activeSession))}`}>
                  {TrackingStatus[getActualStatus(activeSession)]}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {getActualStatus(activeSession) === TrackingStatus.Running ? (
                  <button
                    onClick={handlePauseTracking}
                    disabled={trackingLoading}
                    className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 disabled:opacity-50"
                  >
                    <Pause className="w-4 h-4" />
                    Pause
                  </button>
                ) : (
                  <button
                    onClick={handleResumeTracking}
                    disabled={trackingLoading}
                    className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
                  >
                    <Play className="w-4 h-4" />
                    Resume
                  </button>
                )}
                <button
                  onClick={handleStopTracking}
                  disabled={trackingLoading}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
                >
                  <Square className="w-4 h-4" />
                  Stop
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Category:</span>
                <div className="flex items-center gap-2 mt-1">
                  {activeSession.timeCategoryColor && (
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: activeSession.timeCategoryColor }}
                    />
                  )}
                  <span className="font-medium">{activeSession.timeCategoryName}</span>
                </div>
              </div>
              {activeSession.projectName && (
                <div>
                  <span className="text-gray-500">Project:</span>
                  <div className="font-medium mt-1">{activeSession.projectName}</div>
                </div>
              )}
              {activeSession.taskName && (
                <div>
                  <span className="text-gray-500">Task:</span>
                  <div className="font-medium mt-1">{activeSession.taskName}</div>
                </div>
              )}
              <div>
                <span className="text-gray-500">Started:</span>
                <div className="font-medium mt-1">
                  {new Date(activeSession.startTime).toLocaleTimeString()}
                </div>
              </div>
            </div>

            {activeSession.description && (
              <div>
                <span className="text-gray-500 text-sm">Description:</span>
                <div className="mt-1 text-gray-900">{activeSession.description}</div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">No active tracking session</p>
            <button
              onClick={() => setShowStartModal(true)}
              className="flex items-center gap-2 px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 mx-auto"
            >
              <Play className="w-4 h-4" />
              Start Tracking
            </button>
          </div>
        )}
      </div>

      {/* Recent Time Entries */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Recent Entries
          </h2>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <CirclePlus className="w-4 h-4" />
            Add Entry
          </button>
        </div>

        {recentEntries.length > 0 ? (
          <div className="space-y-3">
            {recentEntries.map((entry) => (
              <div key={entry.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center gap-2">
                    {entry.timeCategoryColor && (
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: entry.timeCategoryColor }}
                      />
                    )}
                    <span className="font-medium">{entry.timeCategoryName}</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {entry.projectName && `${entry.projectName} • `}
                    {formatTime(entry.duration)}
                  </div>
                  {entry.description && (
                    <div className="text-sm text-gray-600 max-w-xs truncate">
                      {entry.description}
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">
                    {new Date(entry.startTime).toLocaleDateString()}
                  </span>
                  <button className="text-gray-400 hover:text-gray-600">
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No time entries found</p>
          </div>
        )}
      </div>

      {/* Start Tracking Modal */}
      {showStartModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={(e) => {
            // Only close modal if clicking on backdrop, not on modal content
            if (e.target === e.currentTarget) {
              setShowStartModal(false);
            }
          }}
        >
          <div 
            className="bg-white rounded-xl shadow-2xl max-w-lg w-full mx-4 transform transition-all"
            onClick={(e) => e.stopPropagation()} // Prevent backdrop click when clicking inside modal
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-4 rounded-t-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                    <Play className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Start Time Tracking</h3>
                    <p className="text-primary-100 text-sm">Track your productivity and manage your time</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowStartModal(false)}
                  className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            {/* Modal Body */}
            <div className="p-6">
              <div className="space-y-5">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                    <Clock className="w-4 h-4 text-primary-500" />
                    Time Category *
                  </label>
                  <CustomSelect
                    value={startTrackingData.timeCategoryId}
                    onChange={(value) => setStartTrackingData({ 
                      ...startTrackingData, 
                      timeCategoryId: value 
                    })}
                    options={[
                      { value: '', label: 'Select a category' },
                      ...(Array.isArray(timeCategories) ? timeCategories.map((category) => ({
                        value: category.id,
                        label: category.name
                      })) : [])
                    ]}
                    placeholder="Select a category"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                    <FolderOpen className="w-4 h-4 text-primary-500" />
                    Project (Optional)
                  </label>
                  <CustomSelect
                    value={startTrackingData.projectId || ''}
                    onChange={(value) => {
                      setStartTrackingData({ 
                        ...startTrackingData, 
                        projectId: value || undefined,
                        taskId: undefined // Reset task when project changes
                      });
                      setTasks([]); // Clear tasks
                      if (value) {
                        loadTasks(value); // Load tasks for selected project
                      }
                    }}
                    options={[
                      { value: '', label: 'Select a project' },
                      ...(Array.isArray(projects) ? projects.map((project) => ({
                        value: project.id,
                        label: project.name
                      })) : [])
                    ]}
                    placeholder="Select a project"
                    className="w-full"
                  />
                </div>

                {startTrackingData.projectId && (
                  <div className="animate-fade-in">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                      <CheckSquare className="w-4 h-4 text-primary-500" />
                      Task (Optional)
                    </label>
                    <CustomSelect
                      value={startTrackingData.taskId || ''}
                      onChange={(value) => setStartTrackingData({ 
                        ...startTrackingData, 
                        taskId: value || undefined 
                      })}
                      options={[
                        { value: '', label: 'No Task' },
                        ...(Array.isArray(tasks) ? tasks.map((task) => ({
                          value: task.id,
                          label: task.title
                        })) : [])
                      ]}
                      placeholder="Select a task"
                      className="w-full"
                    />
                  </div>
                )}

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                    <FileText className="w-4 h-4 text-primary-500" />
                    Description (Optional)
                  </label>
                  <textarea
                    value={startTrackingData.description}
                    onChange={(e) => setStartTrackingData({ 
                      ...startTrackingData, 
                      description: e.target.value 
                    })}
                    placeholder="What are you working on? Describe your task..."
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-6 py-4 rounded-b-xl border-t border-gray-200">
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowStartModal(false)}
                  className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 hover:border-gray-400 transition-all duration-200 flex items-center gap-2 font-medium"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
                <button
                  onClick={handleStartTracking}
                  disabled={trackingLoading || !startTrackingData.timeCategoryId}
                  className="px-6 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg hover:from-primary-600 hover:to-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg transition-all duration-200 font-medium"
                >
                  {trackingLoading ? (
                    <>
                      <LoadingSpinner size="sm" />
                      Starting...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      Start
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeTrackerDashboard;

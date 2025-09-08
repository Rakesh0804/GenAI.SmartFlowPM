'use client';

import React from 'react';
import { BarChart3, TrendingUp, Users, Award, Target, Calendar } from 'lucide-react';

const CampaignDashboard: React.FC = () => {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Campaign Dashboard</h1>
                        <p className="text-gray-600 mt-1">Executive overview and analytics for all campaign activities</p>
                    </div>
                    <div className="flex items-center space-x-3">
                        <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors">
                            Export Report
                        </button>
                    </div>
                </div>
            </div>

            {/* KPI Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-blue-100">
                            <Target className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Active Campaigns</p>
                            <p className="text-2xl font-bold text-gray-900">12</p>
                        </div>
                    </div>
                    <div className="mt-4">
                        <div className="flex items-center text-sm text-green-600">
                            <TrendingUp className="h-4 w-4 mr-1" />
                            <span>+8% from last month</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-green-100">
                            <Users className="h-6 w-6 text-green-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Total Participants</p>
                            <p className="text-2xl font-bold text-gray-900">1,247</p>
                        </div>
                    </div>
                    <div className="mt-4">
                        <div className="flex items-center text-sm text-green-600">
                            <TrendingUp className="h-4 w-4 mr-1" />
                            <span>+15% from last month</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-purple-100">
                            <BarChart3 className="h-6 w-6 text-purple-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                            <p className="text-2xl font-bold text-gray-900">87%</p>
                        </div>
                    </div>
                    <div className="mt-4">
                        <div className="flex items-center text-sm text-green-600">
                            <TrendingUp className="h-4 w-4 mr-1" />
                            <span>+3% from last month</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-orange-100">
                            <Award className="h-6 w-6 text-orange-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Certificates Issued</p>
                            <p className="text-2xl font-bold text-gray-900">1,089</p>
                        </div>
                    </div>
                    <div className="mt-4">
                        <div className="flex items-center text-sm text-green-600">
                            <TrendingUp className="h-4 w-4 mr-1" />
                            <span>+12% from last month</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts and Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Campaign Performance Chart */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Campaign Performance Trends</h3>
                        <select className="text-sm border border-gray-300 rounded-md px-3 py-1">
                            <option>Last 30 days</option>
                            <option>Last 3 months</option>
                            <option>Last 6 months</option>
                        </select>
                    </div>
                    <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                        <div className="text-center">
                            <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                            <p className="text-gray-500">Performance Chart</p>
                            <p className="text-sm text-gray-400">Chart implementation pending</p>
                        </div>
                    </div>
                </div>

                {/* Manager Participation */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Manager Participation</h3>
                        <button className="text-sm text-primary-600 hover:text-primary-700">View All</button>
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                    <span className="text-sm font-medium text-blue-600">JD</span>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-gray-900">John Doe</p>
                                    <p className="text-xs text-gray-500">Engineering Manager</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-medium text-gray-900">95%</p>
                                <p className="text-xs text-gray-500">Completion</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                    <span className="text-sm font-medium text-green-600">AS</span>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-gray-900">Alice Smith</p>
                                    <p className="text-xs text-gray-500">Product Manager</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-medium text-gray-900">88%</p>
                                <p className="text-xs text-gray-500">Completion</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                                    <span className="text-sm font-medium text-purple-600">MJ</span>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-gray-900">Mike Johnson</p>
                                    <p className="text-xs text-gray-500">Sales Manager</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-medium text-gray-900">92%</p>
                                <p className="text-xs text-gray-500">Completion</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Activity and Upcoming Campaigns */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Activity */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                    <div className="space-y-4">
                        <div className="flex items-start">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Target className="h-4 w-4 text-blue-600" />
                            </div>
                            <div className="ml-3 flex-1">
                                <p className="text-sm text-gray-900">Q4 Compliance Campaign launched</p>
                                <p className="text-xs text-gray-500">2 hours ago</p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <Award className="h-4 w-4 text-green-600" />
                            </div>
                            <div className="ml-3 flex-1">
                                <p className="text-sm text-gray-900">125 certificates issued for Security Audit</p>
                                <p className="text-xs text-gray-500">1 day ago</p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <Users className="h-4 w-4 text-purple-600" />
                            </div>
                            <div className="ml-3 flex-1">
                                <p className="text-sm text-gray-900">New user group "Finance Team" created</p>
                                <p className="text-xs text-gray-500">2 days ago</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Upcoming Campaigns */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Campaigns</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center">
                                <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                                <div>
                                    <p className="text-sm font-medium text-gray-900">Annual Security Review</p>
                                    <p className="text-xs text-gray-500">Starts Dec 1, 2025</p>
                                </div>
                            </div>
                            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                                Scheduled
                            </span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center">
                                <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                                <div>
                                    <p className="text-sm font-medium text-gray-900">Role Validation Q1</p>
                                    <p className="text-xs text-gray-500">Starts Jan 15, 2026</p>
                                </div>
                            </div>
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                Draft
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CampaignDashboard;
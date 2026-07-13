import React, { useState } from 'react'
import { Container } from '@/components/common/container'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Eye, EyeOff, Settings } from 'lucide-react'
import Header from '@/components/common/header'
import { PageHeader } from '@/components/common/headSubhead'

const AccountSettingsPage = () => {
  const [activeTab, setActiveTab] = useState('password');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <Container>
      <div className="space-y-6">
        <Header>
          <div className="flex-1 min-w-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <PageHeader
              heading="Account Settings"
              icon={<Settings className="w-9 h-9 text-white" />}
              color="bg-brand-blue shadow-brand-aqua/30"
              subheading="Manage your personal account settings and preferences."
            />
          </div>
        </Header>

        {/* Content Card */}
        <div className="bg-white shadow-sm border border-slate-100">
          {/* Top Header Bar */}
          <div className="bg-brand-blue text-white py-3 text-center font-bold text-[15px]">
            {activeTab === 'password' ? 'Change Password' : 'Change Email'}
          </div>

          <div className="p-6">
            {/* Tabs */}
            <div className="flex mb-8">
              <button
                onClick={() => setActiveTab('password')}
                className={`w-64 py-2.5 text-xs font-bold transition-colors ${
                  activeTab === 'password'
                    ? 'bg-brand-blue text-white'
                    : 'bg-[#e5e7eb] text-gray-600 hover:bg-gray-300'
                }`}
              >
                Change Password
              </button>
              <button
                onClick={() => setActiveTab('email')}
                className={`w-64 py-2.5 text-xs font-bold transition-colors ${
                  activeTab === 'email'
                    ? 'bg-brand-blue text-white'
                    : 'bg-[#e5e7eb] text-gray-600 hover:bg-gray-300'
                }`}
              >
                Change Email
              </button>
            </div>

            {/* Forms */}
            {activeTab === 'password' && (
              <div className="space-y-6 max-w-4xl">
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-800">Old Password</Label>
                  <div className="relative">
                    <Input 
                      type={showOldPassword ? "text" : "password"} 
                      placeholder="Enter old password" 
                      className="pr-10 bg-white border-slate-200"
                    />
                    <button 
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-800 hover:text-slate-900"
                      onClick={() => setShowOldPassword(!showOldPassword)}
                    >
                      {showOldPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-800">New Password</Label>
                  <div className="relative">
                    <Input 
                      type={showNewPassword ? "text" : "password"} 
                      placeholder="Enter Password" 
                      className="pr-10 bg-white border-slate-200"
                    />
                    <button 
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-800 hover:text-slate-900"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-800">Confirm Password</Label>
                  <div className="relative">
                    <Input 
                      type={showConfirmPassword ? "text" : "password"} 
                      placeholder="Enter Confirm Password" 
                      className="pr-10 bg-white border-slate-200"
                    />
                    <button 
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-800 hover:text-slate-900"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button className="bg-brand-blue hover:bg-brand-hoverBlue text-white px-8 font-bold text-xs h-9 rounded-sm">
                    Clear
                  </Button>
                  <Button className="bg-brand-blue hover:bg-brand-hoverBlue text-white px-8 font-bold text-xs h-9 rounded-sm">
                    Submit
                  </Button>
                </div>
              </div>
            )}

            {activeTab === 'email' && (
              <div className="space-y-6 max-w-4xl">
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-800">New Email</Label>
                  <Input 
                    type="email" 
                    placeholder="Enter new email address" 
                    className="bg-white border-slate-200"
                  />
                </div>
                
                <div className="flex gap-4 pt-4">
                  <Button className="bg-brand-blue hover:bg-brand-hoverBlue text-white px-8 font-bold text-xs h-9 rounded-sm">
                    Clear
                  </Button>
                  <Button className="bg-brand-blue hover:bg-brand-hoverBlue text-white px-8 font-bold text-xs h-9 rounded-sm">
                    Submit
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Container>
  )
}

export default AccountSettingsPage

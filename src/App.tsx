import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { WelcomeView } from './components/auth/WelcomeView';
import { RegisterView } from './components/auth/RegisterView';
import { LoginView } from './components/auth/LoginView';
import { EmailVerificationModal } from './components/auth/EmailVerificationModal';
import { ForgotPasswordModal } from './components/auth/ForgotPasswordModal';
import { AddEquipmentModal } from './components/modals/AddEquipmentModal';

// Tabs
import { HomeTab } from './components/tabs/HomeTab';
import { DashboardTab } from './components/tabs/DashboardTab';
import { ScannerTab } from './components/tabs/ScannerTab';
import { EquipmentBookingTab } from './components/tabs/EquipmentBookingTab';
import { AiChatTab } from './components/tabs/AiChatTab';
import { ProfileTab } from './components/tabs/ProfileTab';
import { SettingsTab } from './components/tabs/SettingsTab';
import { PlantHealthTab } from './components/tabs/PlantHealthTab';
import { SoilHealthTab } from './components/tabs/SoilHealthTab';
import { FertilizerGuideTab } from './components/tabs/FertilizerGuideTab';
import { WaterManagementTab } from './components/tabs/WaterManagementTab';
import { MyReportsTab } from './components/tabs/MyReportsTab';

import { EquipmentItem, BookingRecord, ScanReport, SoilReportRecord, NotificationItem, ActivityItem, UserProfile } from './types';

function AgriShareApp() {
  const { user, isLoading } = useAuth();

  // Navigation State
  const [currentTab, setCurrentTab] = useState<string>('Home');
  const [subSection, setSubSection] = useState<string | undefined>('find');

  // Auth Flow Modal / View States
  const [authView, setAuthView] = useState<'none' | 'welcome' | 'login' | 'register'>('none');
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [verificationData, setVerificationData] = useState<{ user: UserProfile; token?: string } | null>(null);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);

  // Equipment Modal State
  const [showAddEquipmentModal, setShowAddEquipmentModal] = useState(false);
  const [equipmentToEdit, setEquipmentToEdit] = useState<EquipmentItem | null>(null);

  // Application Data States
  const [equipmentList, setEquipmentList] = useState<EquipmentItem[]>([]);
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [scans, setScans] = useState<ScanReport[]>([]);
  const [soilReports, setSoilReports] = useState<SoilReportRecord[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);

  // Mobile sidebar drawer state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Initial Data Fetch
  const loadData = async () => {
    try {
      // Equipment
      const eqRes = await fetch('/api/equipment');
      if (eqRes.ok) {
        const eqData = await eqRes.json();
        setEquipmentList(eqData);
      }

      // Bookings
      const bkRes = await fetch('/api/bookings');
      if (bkRes.ok) {
        const bkData = await bkRes.json();
        setBookings(bkData);
      }

      // Scans
      const scRes = await fetch('/api/scans');
      if (scRes.ok) {
        const scData = await scRes.json();
        setScans(scData);
      }

      // Soil Reports
      const slRes = await fetch('/api/soil-tests');
      if (slRes.ok) {
        const slData = await slRes.json();
        setSoilReports(slData);
      }

      // Notifications
      const notifRes = await fetch('/api/notifications');
      if (notifRes.ok) {
        const notifData = await notifRes.json();
        setNotifications(notifData);
      }

      // Activities
      const actRes = await fetch('/api/activities');
      if (actRes.ok) {
        const actData = await actRes.json();
        setActivities(actData);
      }
    } catch (err) {
      console.error('Failed to load initial data:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  // Handle Tab Navigation
  const handleNavigate = (tab: string, sub?: string) => {
    setCurrentTab(tab);
    if (sub) setSubSection(sub);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Actions
  const handleCreateBooking = async (bookingData: any) => {
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error };
      }
      setBookings((prev) => [data, ...prev]);
      loadData();
      return { success: true };
    } catch (err) {
      return { success: false, error: 'Network error booking equipment.' };
    }
  };

  const handleUpdateBookingStatus = async (
    bookingId: string,
    status: 'approved' | 'rejected' | 'completed' | 'cancelled'
  ) => {
    try {
      const res = await fetch(`/api/bookings/${bookingId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, userId: user?.id }),
      });
      if (res.ok) {
        const updated = await res.json();
        setBookings((prev) => prev.map((b) => (b.id === bookingId ? updated : b)));
        loadData();
      }
    } catch (err) {
      console.error('Failed to update booking status', err);
    }
  };

  const handleToggleEquipmentAvailability = async (eqId: string, current: boolean) => {
    try {
      const res = await fetch(`/api/equipment/${eqId}/availability`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isAvailable: !current }),
      });
      if (res.ok) {
        const updated = await res.json();
        setEquipmentList((prev) => prev.map((e) => (e.id === eqId ? updated : e)));
      }
    } catch (err) {
      console.error('Failed to toggle availability', err);
    }
  };

  const handleEditEquipment = (eq: EquipmentItem) => {
    setEquipmentToEdit(eq);
    setShowAddEquipmentModal(true);
  };

  const handleDeleteEquipment = async (eqId: string) => {
    try {
      const res = await fetch(`/api/equipment/${eqId}?userId=${user?.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Failed to remove equipment.' };
      }
      setEquipmentList((prev) => prev.filter((e) => e.id !== eqId));
      loadData();
      return { success: true };
    } catch (err) {
      return { success: false, error: 'Network error deleting equipment.' };
    }
  };

  const handleMarkNotificationRead = async (notifId: string) => {
    try {
      await fetch(`/api/notifications/${notifId}/read`, { method: 'PATCH' });
      setNotifications((prev) =>
        prev.map((n) => (n.id === notifId ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error('Failed to mark notification read', err);
    }
  };

  const handleMarkAllNotificationsRead = async () => {
    try {
      await fetch('/api/notifications/mark-all-read', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user?.id }),
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.error('Failed to mark all notifications read', err);
    }
  };

  const handleSaveScanReport = async (report: any) => {
    try {
      const res = await fetch('/api/scans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(report),
      });
      if (res.ok) {
        const saved = await res.json();
        setScans((prev) => [saved, ...prev]);
        loadData();
      }
    } catch (err) {
      console.error('Failed to save scan report', err);
    }
  };

  const handleDeleteScanReport = async (scanId: string) => {
    try {
      const res = await fetch(`/api/scans/${scanId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setScans((prev) => prev.filter((s) => s.id !== scanId));
      }
    } catch (err) {
      console.error('Failed to delete scan report', err);
    }
  };

  const handleAddScanObservation = async (scanId: string, note: string) => {
    try {
      const res = await fetch(`/api/scans/${scanId}/observations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note, userId: user?.id }),
      });
      if (res.ok) {
        const updatedScan = await res.json();
        setScans((prev) => prev.map((s) => (s.id === scanId ? updatedScan : s)));
        return true;
      }
      return false;
    } catch (err) {
      console.error('Failed to add scan observation', err);
      return false;
    }
  };

  const handleSaveSoilReport = async (report: any) => {
    try {
      const res = await fetch('/api/soil-tests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(report),
      });
      if (res.ok) {
        const saved = await res.json();
        setSoilReports((prev) => [saved, ...prev]);
        loadData();
      }
    } catch (err) {
      console.error('Failed to save soil report', err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F4F8F5] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-bold text-gray-700">Loading AgriShare Platform...</p>
        </div>
      </div>
    );
  }

  // If user is not logged in and explicitly opened Welcome/Login/Register, render auth views
  if (!user && authView === 'welcome') {
    return (
      <WelcomeView
        onGoToLogin={() => setAuthView('login')}
        onGoToRegister={() => setAuthView('register')}
        onContinueAsGuest={() => setAuthView('none')}
      />
    );
  }

  if (authView === 'login') {
    return (
      <>
        <LoginView
          onGoToRegister={() => setAuthView('register')}
          onGoToWelcome={() => setAuthView('welcome')}
          onForgotPassword={() => setShowForgotPasswordModal(true)}
          onLoginSuccess={() => {
            setAuthView('none');
            loadData();
          }}
        />
        {showForgotPasswordModal && (
          <ForgotPasswordModal
            onClose={() => setShowForgotPasswordModal(false)}
            onSuccessRedirectToLogin={() => {
              setShowForgotPasswordModal(false);
              setAuthView('login');
            }}
          />
        )}
      </>
    );
  }

  if (authView === 'register') {
    return (
      <>
        <RegisterView
          onGoToLogin={() => setAuthView('login')}
          onRegisteredSuccess={(newUser, token) => {
            setVerificationData({ user: newUser, token });
            setShowVerificationModal(true);
            setAuthView('none');
          }}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAF9] flex flex-col font-sans text-gray-900 selection:bg-emerald-200">
      {/* Top Header Matching Screenshot */}
      <Header
        currentTab={currentTab}
        onNavigate={handleNavigate}
        onOpenLogin={() => setAuthView('login')}
        onOpenRegister={() => setAuthView('register')}
        notifications={notifications}
        onMarkNotificationRead={handleMarkNotificationRead}
        onMarkAllNotificationsRead={handleMarkAllNotificationsRead}
      />

      {/* Main Layout: Fixed Sidebar + Scrollable Content */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Left Sidebar Matching Screenshot */}
        <Sidebar
          currentTab={currentTab}
          onSelectTab={(tab) => handleNavigate(tab)}
          isOpenMobile={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
        />

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-y-auto">
          {currentTab === 'Home' && (
            <HomeTab
              onNavigate={handleNavigate}
              equipmentList={equipmentList}
              activities={activities}
              notifications={notifications}
              onSelectEquipment={(eq) => {
                handleNavigate('Equipment Booking', 'find');
              }}
            />
          )}

          {currentTab === 'Dashboard' && (
            <DashboardTab
              bookings={bookings}
              equipmentList={equipmentList}
              scans={scans}
              soilReports={soilReports}
              onNavigate={handleNavigate}
              onUpdateBookingStatus={handleUpdateBookingStatus}
              onToggleEquipmentAvailability={handleToggleEquipmentAvailability}
              onOpenAddEquipmentModal={() => setShowAddEquipmentModal(true)}
            />
          )}

          {currentTab === 'Scanner' && (
            <ScannerTab
              onSaveReport={handleSaveScanReport}
              onNavigateToReports={() => handleNavigate('MyReports')}
            />
          )}

          {currentTab === 'Equipment Booking' && (
            <EquipmentBookingTab
              initialSubTab={subSection}
              equipmentList={equipmentList}
              bookings={bookings}
              onCreateBooking={handleCreateBooking}
              onUpdateBookingStatus={handleUpdateBookingStatus}
              onOpenAddEquipmentModal={() => {
                setEquipmentToEdit(null);
                setShowAddEquipmentModal(true);
              }}
              onEditEquipment={handleEditEquipment}
              onDeleteEquipment={handleDeleteEquipment}
              onToggleEquipmentAvailability={handleToggleEquipmentAvailability}
            />
          )}

          {currentTab === 'AI Chat' && <AiChatTab savedScans={scans} />}

          {currentTab === 'Profile' && <ProfileTab />}

          {currentTab === 'Settings' && <SettingsTab />}

          {/* Quick Access Linked Tabs */}
          {currentTab === 'PlantHealth' && (
            <PlantHealthTab
              scans={scans}
              onOpenScanner={() => handleNavigate('Scanner')}
              onAddObservation={handleAddScanObservation}
            />
          )}

          {currentTab === 'SoilHealth' && (
            <SoilHealthTab
              onSaveSoilReport={handleSaveSoilReport}
              savedSoilReports={soilReports}
            />
          )}

          {currentTab === 'FertilizerGuide' && (
            <FertilizerGuideTab savedSoilReports={soilReports} />
          )}

          {currentTab === 'WaterManagement' && <WaterManagementTab />}

          {currentTab === 'MyReports' && (
            <MyReportsTab
              scans={scans}
              soilReports={soilReports}
              onDeleteScan={handleDeleteScanReport}
              onDiscussWithAi={() => handleNavigate('AI Chat')}
            />
          )}
        </main>
      </div>

      {/* Email Verification Modal */}
      {showVerificationModal && verificationData && (
        <EmailVerificationModal
          user={verificationData.user}
          initialToken={verificationData.token}
          onVerified={() => {
            setShowVerificationModal(false);
            setVerificationData(null);
            handleNavigate('Dashboard');
          }}
          onSkipToDashboard={() => {
            setShowVerificationModal(false);
            setVerificationData(null);
            handleNavigate('Dashboard');
          }}
        />
      )}

      {/* Forgot Password Modal */}
      {showForgotPasswordModal && (
        <ForgotPasswordModal
          onClose={() => setShowForgotPasswordModal(false)}
          onSuccessRedirectToLogin={() => {
            setShowForgotPasswordModal(false);
            setAuthView('login');
          }}
        />
      )}

      {/* Add / Edit Equipment Modal for Owners */}
      {showAddEquipmentModal && (
        <AddEquipmentModal
          equipmentToEdit={equipmentToEdit}
          onClose={() => {
            setShowAddEquipmentModal(false);
            setEquipmentToEdit(null);
          }}
          onEquipmentAdded={(newEq) => {
            setEquipmentList((prev) => [newEq, ...prev]);
            loadData();
          }}
          onEquipmentUpdated={(upEq) => {
            setEquipmentList((prev) => prev.map((e) => (e.id === upEq.id ? upEq : e)));
            loadData();
          }}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AgriShareApp />
    </AuthProvider>
  );
}

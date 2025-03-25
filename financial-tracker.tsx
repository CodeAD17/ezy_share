"use client"

import { useState, useEffect, useRef } from "react"
import { ChevronDown, ChevronLeft, Clock, MoreVertical, Briefcase, Home, Folder, BarChart3, Settings, Bell, ArrowUp, ArrowDown, X, Phone, Mail } from "lucide-react"
import { cn } from "@/lib/utils"
import QRCode from "react-qr-code"
import { Html5Qrcode } from "html5-qrcode"
import { FaFacebook, FaInstagram, FaTwitter, FaTelegram, FaSnapchatGhost, FaLinkedin } from "react-icons/fa"

type UserData = {
  name: string;
  role: string;
  contact: {
    phone: string;
    email: string;
  };
  social: {
    personal: {
      facebook: string;
      instagram: string;
      twitter: string;
      telegram: string;
      snapchat: string;
    };
    professional: {
      linkedin: string;
    };
  };
}

export default function YourPocket() {
  const [currentView, setCurrentView] = useState("home") // "home" or "qr"
  const [activeTab, setActiveTab] = useState("Your QR")
  const [scanning, setScanning] = useState(false)
  const scannerRef = useRef(null)
  const [isEditing, setIsEditing] = useState(false)
  
  // Move userData to state
  const [userData, setUserData] = useState<UserData>({
    name: "Drew Hays",
    role: "Elderly People Care",
    contact: {
      phone: "+1 234 567 890",
      email: "drew.hays@example.com"
    },
    social: {
      personal: {
        facebook: "drewhays",
        instagram: "drew.hays",
        twitter: "@drewhays",
        telegram: "@drew_hays",
        snapchat: "drew.hays"
      },
      professional: {
        linkedin: "linkedin.com/in/drewhays"
      }
    }
  })

  const [editedUserData, setEditedUserData] = useState<UserData>({
    name: "",
    role: "",
    contact: {
      phone: "",
      email: "",
    },
    social: {
      personal: {
        facebook: "",
        instagram: "",
        twitter: "",
        telegram: "",
        snapchat: "",
      },
      professional: {
        linkedin: "",
      },
    },
  })

  useEffect(() => {
    let html5QrCode;

    const startScanner = async () => {
      if (activeTab === "Scan QR" && !scanning) {
        try {
          html5QrCode = new Html5Qrcode("reader");
          setScanning(true);
          
          await html5QrCode.start(
            { facingMode: "environment" },
            {
              fps: 10,
              qrbox: { width: 250, height: 250 }
            },
            (decodedText) => {
              console.log('Scanned QR:', decodedText);
              // Handle successful scan here
            },
            (error) => {
              // Handle errors silently
            }
          );
        } catch (err) {
          console.error(err);
        }
      }
    };

    if (activeTab === "Scan QR") {
      startScanner();
    }

    return () => {
      if (html5QrCode && html5QrCode.isScanning) {
        html5QrCode.stop().then(() => {
          html5QrCode.clear();
          setScanning(false);
        });
      }
    };
  }, [activeTab]);

  useEffect(() => {
    if (isEditing) {
      setEditedUserData(userData)
    }
  }, [isEditing, userData])

  const EditProfileModal = () => {
    // Add local state to manage form data
    const [formData, setFormData] = useState(editedUserData);

    // Handle input changes
    const handleInputChange = (path: string[], value: string) => {
      setFormData(prev => {
        const newData = { ...prev };
        let current: any = newData;
        
        // Navigate to the correct nested property
        for (let i = 0; i < path.length - 1; i++) {
          current = current[path[i]];
        }
        
        // Set the value
        current[path[path.length - 1]] = value;
        return newData;
      });
    };

    // Handle save with local state
    const handleSave = () => {
      // Update both editedUserData and userData
      setEditedUserData(formData);
      setUserData(formData);
      setIsEditing(false);
    };

    return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-zinc-900 rounded-3xl p-6 w-full max-w-[340px] space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-white text-xl font-medium">Edit Profile</h3>
          <button 
            onClick={() => setIsEditing(false)}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-zinc-800"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Basic Info */}
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={(e) => handleInputChange(['name'], e.target.value)}
              className="w-full bg-zinc-800 rounded-xl px-4 py-2 text-white"
            />
            <input
              type="text"
              placeholder="Role"
              value={formData.role}
              onChange={(e) => handleInputChange(['role'], e.target.value)}
              className="w-full bg-zinc-800 rounded-xl px-4 py-2 text-white"
            />
          </div>

          {/* Contact Info */}
          <div className="space-y-2">
            <h4 className="text-zinc-400">Contact Information</h4>
            <div className="relative">
              <input
                type="tel"
                placeholder="Phone"
                value={formData.contact.phone}
                onChange={(e) => handleInputChange(['contact', 'phone'], e.target.value)}
                className="w-full bg-zinc-800 rounded-xl pl-10 pr-4 py-2 text-white"
              />
              <Phone className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
            <div className="relative">
              <input
                type="email"
                placeholder="Email"
                value={formData.contact.email}
                onChange={(e) => handleInputChange(['contact', 'email'], e.target.value)}
                className="w-full bg-zinc-800 rounded-xl pl-10 pr-4 py-2 text-white"
              />
              <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Social Media */}
          <div className="space-y-2">
            <h4 className="text-zinc-400">Social Media</h4>
            <div className="relative">
              <input
                type="text"
                placeholder="Facebook"
                value={formData.social.personal.facebook}
                onChange={(e) => handleInputChange(['social', 'personal', 'facebook'], e.target.value)}
                className="w-full bg-zinc-800 rounded-xl pl-10 pr-4 py-2 text-white"
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <FaFacebook className="w-4 h-4 text-blue-500" />
              </div>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Instagram"
                value={formData.social.personal.instagram}
                onChange={(e) => handleInputChange(['social', 'personal', 'instagram'], e.target.value)}
                className="w-full bg-zinc-800 rounded-xl pl-10 pr-4 py-2 text-white"
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <FaInstagram className="w-4 h-4 text-pink-500" />
              </div>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Twitter"
                value={formData.social.personal.twitter}
                onChange={(e) => handleInputChange(['social', 'personal', 'twitter'], e.target.value)}
                className="w-full bg-zinc-800 rounded-xl pl-10 pr-4 py-2 text-white"
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <FaTwitter className="w-4 h-4 text-blue-400" />
              </div>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Telegram"
                value={formData.social.personal.telegram}
                onChange={(e) => handleInputChange(['social', 'personal', 'telegram'], e.target.value)}
                className="w-full bg-zinc-800 rounded-xl pl-10 pr-4 py-2 text-white"
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <FaTelegram className="w-4 h-4 text-blue-500" />
              </div>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Snapchat"
                value={formData.social.personal.snapchat}
                onChange={(e) => handleInputChange(['social', 'personal', 'snapchat'], e.target.value)}
                className="w-full bg-zinc-800 rounded-xl pl-10 pr-4 py-2 text-white"
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <FaSnapchatGhost className="w-4 h-4 text-yellow-400" />
              </div>
            </div>
          </div>

          {/* Professional */}
          <div className="space-y-2">
            <h4 className="text-zinc-400">Professional</h4>
            <div className="relative">
              <input
                type="text"
                placeholder="LinkedIn"
                value={formData.social.professional.linkedin}
                onChange={(e) => handleInputChange(['social', 'professional', 'linkedin'], e.target.value)}
                className="w-full bg-zinc-800 rounded-xl pl-10 pr-4 py-2 text-white"
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <FaLinkedin className="w-4 h-4 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        <button 
          onClick={handleSave}
          className="w-full bg-[#c1ff9b] text-black rounded-full py-3 font-medium"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

  return (
    <div className="flex justify-center items-center min-h-screen bg-black">
      <div className="w-[375px] h-[812px] bg-zinc-900 overflow-hidden relative">
        <div className="relative w-full h-full">
          {/* Home View */}
          <div 
            className={cn(
              "absolute inset-0 w-full h-full p-5 transition-all duration-300 ease-in-out",
              currentView === "home" 
                ? "translate-x-0 opacity-100" 
                : "-translate-x-full opacity-0"
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              {/* Profile Container */}
              <div className="flex items-center gap-3 bg-zinc-800/50 rounded-3xl p-4">
                <img 
                  src="https://ui-avatars.com/api/?name=Drew+Hays"
                  alt="Profile" 
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h2 className="text-white font-medium">{userData.name}</h2>
                  <p className="text-zinc-400 text-sm">{userData.role}</p>
                </div>
              </div>

              {/* Settings Container */}
              <div className="flex gap-3 bg-zinc-800/70 rounded-3xl p-2">
                <button className="w-10 h-10 flex items-center justify-center rounded-full bg-zinc-900">
                  <Settings className="w-5 h-5 text-white" />
                </button>
                <button className="w-10 h-10 flex items-center justify-center rounded-full bg-zinc-900">
                  <Bell className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            {/* Balance */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-zinc-400"></p>
               
              </div>
              <h1 className="text-4xl font-bold text-white"></h1>
            </div>

            {/* Contact Information */}
            <div className="bg-zinc-800 rounded-3xl p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-zinc-400">Phone Number</p>
                  <p className="text-xl font-bold text-white">{userData.contact.phone}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-zinc-400">Email Address</p>
                  <p className="text-xl font-bold text-white">{userData.contact.email}</p>
                </div>
              </div>
            </div>

            {/* Social Media Profiles */}
            <div className="space-y-4">
              <h3 className="text-white font-medium">Social Media Profiles</h3>
              <div className="space-y-4">
                <div className="bg-zinc-800 rounded-3xl p-4 space-y-4">
                  {/* Personal Social Media */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                          <FaFacebook className="w-5 h-5 text-blue-500" />
                        </div>
                        <p className="text-zinc-400">Facebook</p>
                      </div>
                      <p className="text-white">{userData.social.personal.facebook}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                          <FaInstagram className="w-5 h-5 text-pink-500" />
                        </div>
                        <p className="text-zinc-400">Instagram</p>
                      </div>
                      <p className="text-white">{userData.social.personal.instagram}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                          <FaTwitter className="w-5 h-5 text-blue-400" />
                        </div>
                        <p className="text-zinc-400">X (Twitter)</p>
                      </div>
                      <p className="text-white">{userData.social.personal.twitter}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                          <FaTelegram className="w-5 h-5 text-blue-500" />
                        </div>
                        <p className="text-zinc-400">Telegram</p>
                      </div>
                      <p className="text-white">{userData.social.personal.telegram}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                          <FaSnapchatGhost className="w-5 h-5 text-yellow-400" />
                        </div>
                        <p className="text-zinc-400">Snapchat</p>
                      </div>
                      <p className="text-white">{userData.social.personal.snapchat}</p>
                    </div>
                  </div>

                  {/* Professional Section */}
                  <div className="pt-2 border-t border-zinc-700">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                          <FaLinkedin className="w-5 h-5 text-blue-600" />
                        </div>
                        <p className="text-zinc-400">LinkedIn</p>
                      </div>
                      <p className="text-white">{userData.social.professional.linkedin}</p>
                    </div>
                  </div>

                  <button 
                    onClick={() => setIsEditing(true)} 
                    className="w-full bg-[#c1ff9b] text-black rounded-full py-3 font-medium"
                  >
                    Edit Profile
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* QR View */}
          <div 
            className={cn(
              "absolute inset-0 w-full h-full transition-all duration-300 ease-in-out overflow-y-auto",
              currentView === "qr" 
                ? "translate-x-0 opacity-100" 
                : "translate-x-full opacity-0"
            )}
          >
            <div className="w-full h-full p-5 space-y-6 pb-24">
          {/* Header */}
          <div className="flex items-center justify-between w-full">
            <button className="w-10 h-10 flex items-center justify-center rounded-full bg-zinc-800">
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
            <h1 className="text-xl font-medium text-white">Your Pocket</h1>
            <button className="w-10 h-10 flex items-center justify-center rounded-full bg-zinc-800">
              <MoreVertical className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Main Card */}
              <div className="w-full rounded-3xl bg-[#e3ffd9] p-6 space-y-6">
            {/* Tabs */}
                <div className="flex items-center justify-between">
              <div className="flex space-x-2 bg-zinc-800 rounded-full p-1">
                    {["Your QR", "Scan QR"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                          "px-4 py-1.5 rounded-full text-sm font-medium",
                      activeTab === tab ? "bg-zinc-900 text-white" : "text-zinc-400",
                    )}
                  >
                    {tab}
                  </button>
                ))}
              </div>
                </div>

                {/* QR Content */}
                <div className="flex flex-col items-center justify-center min-h-[320px] py-4">
                  {activeTab === "Your QR" ? (
                    <div className="bg-white p-4 rounded-lg" style={{ border: '4px solid black' }}>
                      <QRCode
                        value={JSON.stringify(userData)}
                        size={256}
                        level="H"
                        style={{ display: 'block' }}
                      />
                    </div>
                  ) : (
                    <div 
                      id="reader" 
                      className="w-full h-[300px] overflow-hidden rounded-lg"
                    />
                  )}
                </div>

                {/* Action Button */}
                <button className="w-full bg-[#c1ff9b] text-black rounded-full py-3.5 font-medium text-base">
                  {activeTab === "Your QR" ? "Download QR" : "Save Contact"}
                </button>
          </div>

          {/* Tracking by categories */}
              <div className="space-y-4">
                <h2 className="text-lg font-medium text-white">Tracking by categories</h2>
                <div className="grid grid-cols-2 gap-4">
              <div className="bg-zinc-800 rounded-2xl p-4">
                <div className="flex justify-between mb-2">
                  <div>
                    <p className="text-sm text-zinc-400">Monthly</p>
                    <p className="text-sm text-zinc-400">Salary</p>
                  </div>
                  <div className="w-8 h-8 flex items-center justify-center bg-zinc-700 rounded-full">
                    <Briefcase className="w-4 h-4 text-white" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-white">+$3,190</p>
              </div>

                  <div className="bg-[#e3ffd9] rounded-2xl p-4">
                <div className="flex justify-between mb-2">
                  <div>
                    <p className="text-sm text-zinc-700">Stack</p>
                    <p className="text-sm text-zinc-700">Dividend</p>
                  </div>
                  <div className="w-8 h-8 flex items-center justify-center bg-white rounded-full">
                    <Clock className="w-4 h-4" />
                  </div>
                </div>
                    <p className="text-2xl font-bold text-black">+$400</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-zinc-800 rounded-full px-4 py-3 w-[90%] flex items-center justify-between">
          <button 
            onClick={() => setCurrentView("home")}
            className={cn(
              "w-12 h-12 flex items-center justify-center rounded-full",
              currentView === "home" ? "bg-[#c1ff9b]" : "bg-white"
            )}
          >
            <Home className="w-5 h-5 text-black" />
          </button>
          <button 
            onClick={() => setCurrentView("qr")}
            className={cn(
              "w-12 h-12 flex items-center justify-center rounded-full",
              currentView === "qr" ? "bg-[#c1ff9b]" : "bg-white"
            )}
          >
            <Folder className="w-5 h-5 text-black" />
          </button>
          <div className="flex items-center">
            <span className="mr-8 text-white">
              {currentView === "home" ? "Dashboard" : "Your Pocket"}
            </span>
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
        </div>

        {isEditing && <EditProfileModal />}
      </div>
    </div>
  )
}


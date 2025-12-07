import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, UserPlus, X, Check, Loader2, Users, GraduationCap, Heart } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';

interface AddConnectionsProps {
  userRole: 'student' | 'teacher' | 'parent';
  onClose?: () => void;
}

export function AddConnections({ userRole, onClose }: AddConnectionsProps) {
  const [email, setEmail] = useState('');
  const [invites, setInvites] = useState<Array<{ email: string; status: 'pending' | 'sent' | 'error' }>>([]);
  const [isLoading, setIsLoading] = useState(false);

  const getConnectionTypes = () => {
    if (userRole === 'student') {
      return [
        { type: 'teacher', label: 'Add Teacher', icon: GraduationCap, color: '#10B981', bgColor: '#ECFDF5', description: 'Your teacher will be able to create and assign lessons to you' },
        { type: 'parent', label: 'Add Parent/Guardian', icon: Heart, color: '#F97316', bgColor: '#FFF7ED', description: 'Your parent can track your progress and celebrate achievements' }
      ];
    } else if (userRole === 'teacher') {
      return [
        { type: 'student', label: 'Add Students', icon: Users, color: '#4F46E5', bgColor: '#F0F4FF', description: 'Add students to your class and assign personalized lessons' }
      ];
    }
    return [];
  };

  const connectionTypes = getConnectionTypes();
  const [selectedType, setSelectedType] = useState(connectionTypes[0]?.type || 'teacher');

  const handleAddEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) return;

    setIsLoading(true);
    
    // Add to pending invites
    setInvites(prev => [...prev, { email, status: 'pending' }]);

    // Simulate API call
    setTimeout(() => {
      setInvites(prev => 
        prev.map(invite => 
          invite.email === email ? { ...invite, status: 'sent' } : invite
        )
      );
      setEmail('');
      setIsLoading(false);
    }, 1000);
  };

  const handleRemoveInvite = (emailToRemove: string) => {
    setInvites(prev => prev.filter(invite => invite.email !== emailToRemove));
  };

  const currentConnectionType = connectionTypes.find(ct => ct.type === selectedType);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#F0F4FF] flex items-center justify-center">
              <UserPlus className="w-6 h-6 text-[#4F46E5]" />
            </div>
            <div>
              <h2 className="text-[#111827]">Connect Your {userRole === 'student' ? 'Team' : 'Students'}</h2>
              <p className="text-sm text-[#6B7280]">
                {userRole === 'student' 
                  ? 'Add your teachers and parents to get started' 
                  : 'Invite students to join your class'}
              </p>
            </div>
          </div>
          {onClose && (
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="rounded-xl"
            >
              <X className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>

      {/* Connection Type Selection (for students) */}
      {userRole === 'student' && (
        <div className="grid grid-cols-2 gap-4 mb-8">
          {connectionTypes.map((type) => (
            <motion.button
              key={type.type}
              onClick={() => setSelectedType(type.type)}
              className={`p-4 rounded-2xl border-2 transition-all text-left ${
                selectedType === type.type
                  ? 'border-[#4F46E5] bg-[#F0F4FF]'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-3 mb-2">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: type.bgColor }}
                >
                  <type.icon className="w-5 h-5" style={{ color: type.color }} />
                </div>
                <span className="font-semibold text-[#111827]">{type.label}</span>
              </div>
            </motion.button>
          ))}
        </div>
      )}

      {/* Description Card */}
      {currentConnectionType && (
        <Card className="p-4 mb-6 border-2 border-gray-200 rounded-2xl">
          <div className="flex items-start gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: currentConnectionType.bgColor }}
            >
              <currentConnectionType.icon className="w-5 h-5" style={{ color: currentConnectionType.color }} />
            </div>
            <div>
              <p className="font-semibold text-[#111827] mb-1">{currentConnectionType.label}</p>
              <p className="text-sm text-[#6B7280]">{currentConnectionType.description}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Email Input Form */}
      <form onSubmit={handleAddEmail} className="mb-6">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={`Enter ${selectedType}'s email address`}
              className="pl-12 h-12 rounded-xl border-2 border-gray-200 focus:border-[#4F46E5]"
              disabled={isLoading}
            />
          </div>
          <Button
            type="submit"
            disabled={!email.trim() || !email.includes('@') || isLoading}
            className="h-12 px-6 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <UserPlus className="w-5 h-5 mr-2" />
                Send Invite
              </>
            )}
          </Button>
        </div>
        <p className="text-sm text-[#6B7280] mt-2">
          {userRole === 'student' 
            ? `We'll send an invitation to your ${selectedType}'s email`
            : "We'll send an invitation to the student's email"}
        </p>
      </form>

      {/* Invites List */}
      {invites.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-[#111827]">
              Pending Invitations ({invites.length})
            </h3>
          </div>
          
          <AnimatePresence mode="popLayout">
            {invites.map((invite) => (
              <motion.div
                key={invite.email}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                className={`flex items-center justify-between p-4 rounded-xl border-2 ${
                  invite.status === 'sent' 
                    ? 'bg-[#ECFDF5] border-[#10B981]/20' 
                    : invite.status === 'error'
                    ? 'bg-red-50 border-red-200'
                    : 'bg-white border-gray-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    invite.status === 'sent' 
                      ? 'bg-[#10B981]/10' 
                      : invite.status === 'error'
                      ? 'bg-red-100'
                      : 'bg-gray-100'
                  }`}>
                    {invite.status === 'sent' ? (
                      <Check className="w-5 h-5 text-[#10B981]" />
                    ) : invite.status === 'pending' ? (
                      <Loader2 className="w-5 h-5 text-[#6B7280] animate-spin" />
                    ) : (
                      <Mail className="w-5 h-5 text-[#6B7280]" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-[#111827]">{invite.email}</p>
                    <p className="text-sm text-[#6B7280]">
                      {invite.status === 'sent' 
                        ? 'Invitation sent successfully' 
                        : invite.status === 'error'
                        ? 'Failed to send invitation'
                        : 'Sending invitation...'}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => handleRemoveInvite(invite.email)}
                  variant="ghost"
                  size="sm"
                  className="rounded-xl"
                >
                  <X className="w-4 h-4" />
                </Button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Empty State */}
      {invites.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-[#6B7280]" />
          </div>
          <h3 className="font-semibold text-[#111827] mb-2">No invitations sent yet</h3>
          <p className="text-sm text-[#6B7280] max-w-md mx-auto">
            {userRole === 'student'
              ? `Enter your ${selectedType}'s email above to send them an invitation`
              : 'Enter student email addresses above to send them invitations'}
          </p>
        </div>
      )}

      {/* Info Note */}
      <div className="mt-8 p-4 bg-[#F0F4FF] rounded-xl border border-[#4F46E5]/20">
        <div className="flex gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#4F46E5]/10 flex items-center justify-center shrink-0">
            <Mail className="w-4 h-4 text-[#4F46E5]" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[#111827] mb-1">How it works</p>
            <ul className="text-sm text-[#6B7280] space-y-1">
              <li>• They'll receive an email invitation with a link to join</li>
              <li>• Once they accept, they'll be connected to your account</li>
              <li>• You can add multiple {userRole === 'student' ? 'teachers and parents' : 'students'}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import clsx from 'clsx';

interface PasswordStrengthProps {
  password: string;
  showStrength?: boolean;
}

interface StrengthLevel {
  score: number;
  label: string;
  color: string;
  bgColor: string;
}

const PasswordStrength: React.FC<PasswordStrengthProps> = ({ 
  password, 
  showStrength = true 
}) => {
  // Calculate password strength
  const calculateStrength = (pwd: string): StrengthLevel => {
    let score = 0;
    
    // Length check
    if (pwd.length >= 8) score += 1;
    if (pwd.length >= 12) score += 1;
    
    // Character variety checks
    if (/[a-z]/.test(pwd)) score += 1; // lowercase
    if (/[A-Z]/.test(pwd)) score += 1; // uppercase
    if (/[0-9]/.test(pwd)) score += 1; // numbers
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1; // special characters
    
    // Return strength level based on score
    if (score <= 2) return { score, label: 'Weak', color: 'text-red-600', bgColor: 'bg-red-500' };
    if (score <= 4) return { score, label: 'Medium', color: 'text-yellow-600', bgColor: 'bg-yellow-500' };
    return { score, label: 'Strong', color: 'text-green-600', bgColor: 'bg-green-500' };
  };

  const strength = calculateStrength(password);
  
  // Don't show anything if password is empty
  if (!password || !showStrength) {
    return null;
  }

  return (
    <div className="mt-2 space-y-2">
      {/* Strength Bar */}
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5, 6].map((level) => (
          <div
            key={level}
            className={clsx(
              'h-2 flex-1 rounded-full transition-colors',
              level <= strength.score ? strength.bgColor : 'bg-gray-200'
            )}
          />
        ))}
      </div>

      {/* Strength Label */}
      <div className="flex justify-between items-center">
        <span className={clsx('text-sm font-medium', strength.color)}>
          Password strength: {strength.label}
        </span>
        <span className="text-xs text-gray-500">
          {strength.score}/6
        </span>
      </div>

      {/* Password Requirements */}
      <div className="text-xs text-gray-600 space-y-1">
        <p className="font-medium">Password should contain:</p>
        <ul className="space-y-1">
          <li className={clsx('flex items-center', password.length >= 8 ? 'text-green-600' : 'text-gray-500')}>
            <span className="mr-2">{password.length >= 8 ? '✓' : '○'}</span>
            At least 8 characters
          </li>
          <li className={clsx('flex items-center', /[a-z]/.test(password) ? 'text-green-600' : 'text-gray-500')}>
            <span className="mr-2">{/[a-z]/.test(password) ? '✓' : '○'}</span>
            One lowercase letter
          </li>
          <li className={clsx('flex items-center', /[A-Z]/.test(password) ? 'text-green-600' : 'text-gray-500')}>
            <span className="mr-2">{/[A-Z]/.test(password) ? '✓' : '○'}</span>
            One uppercase letter
          </li>
          <li className={clsx('flex items-center', /[0-9]/.test(password) ? 'text-green-600' : 'text-gray-500')}>
            <span className="mr-2">{/[0-9]/.test(password) ? '✓' : '○'}</span>
            One number
          </li>
          <li className={clsx('flex items-center', /[^A-Za-z0-9]/.test(password) ? 'text-green-600' : 'text-gray-500')}>
            <span className="mr-2">{/[^A-Za-z0-9]/.test(password) ? '✓' : '○'}</span>
            One special character
          </li>
        </ul>
      </div>
    </div>
  );
};

export default PasswordStrength;

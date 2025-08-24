# Anti-Adblock Components

This directory contains React components for detecting and handling ad blockers on your paste-sharing site.

## Components

### 1. `anti-adblock.tsx` - Basic Anti-Adblock Detection
A simple component that detects ad blockers using basic element-based detection.

### 2. `anti-adblock-advanced.tsx` - Advanced Anti-Adblock Detection
A comprehensive component that uses multiple detection methods and provides a sophisticated warning modal.

## Usage

### Basic Usage
```tsx
import AntiAdblock from '@/components/anti-adblock'

function MyComponent() {
  return (
    <div>
      <h1>My App</h1>
      <AntiAdblock 
        onAdblockDetected={() => console.log('Ad blocker found')}
        onAdblockNotDetected={() => console.log('No ad blocker')}
        showWarning={true}
      />
    </div>
  )
}
```

### Advanced Usage
```tsx
import AntiAdblockAdvanced from '@/components/anti-adblock-advanced'

function MyComponent() {
  return (
    <div>
      <h1>My App</h1>
      <AntiAdblockAdvanced 
        onAdblockDetected={() => {
          // Custom logic when ad blocker is detected
          console.log('Ad blocker detected')
        }}
        onAdblockNotDetected={() => {
          // Custom logic when no ad blocker is detected
          console.log('No ad blocker detected')
        }}
        showWarning={true}
        customWarningMessage="Custom warning message for your users"
      />
    </div>
  )
}
```

## Props

### AntiAdblock Props
- `onAdblockDetected?: () => void` - Callback when ad blocker is detected
- `onAdblockNotDetected?: () => void` - Callback when no ad blocker is detected
- `showWarning?: boolean` - Whether to show the warning modal (default: true)

### AntiAdblockAdvanced Props
- `onAdblockDetected?: () => void` - Callback when ad blocker is detected
- `onAdblockNotDetected?: () => void` - Callback when no ad blocker is detected
- `showWarning?: boolean` - Whether to show the warning modal (default: true)
- `customWarningMessage?: string` - Custom message to display in the warning modal

## Features

### Detection Methods
1. **Element-based detection** - Creates test ad elements and checks if they're blocked
2. **Script-based detection** - Checks if ad-related scripts are blocked
3. **Function-based detection** - Checks if ad-related functions are available

### Warning Modal Features
- Modern, responsive design
- Customizable warning message
- Multiple action buttons (Disable Ad Blocker, Refresh Page, Close)
- Auto-close after 60 seconds
- Periodic re-checking every 30 seconds
- Clean up on component unmount

## Integration

The components are already integrated into the main layout (`app/layout.tsx`) via the `AntiAdblockWrapper` component and will automatically detect ad blockers across your entire application.

### Files Structure
- `anti-adblock.tsx` - Basic anti-adblock component
- `anti-adblock-advanced.tsx` - Advanced anti-adblock component with multiple detection methods
- `anti-adblock-wrapper.tsx` - Client wrapper component for server-side integration
- `app/layout.tsx` - Main layout with integrated anti-adblock functionality

## Customization

You can customize the warning modal by modifying the `showAdvancedWarning` function in the component, or by using the `customWarningMessage` prop for simple text changes.

## Legal Notice

The anti-adblock detection includes obfuscated code patterns similar to those found in commercial anti-adblock solutions. This implementation is for educational and legitimate business purposes only.

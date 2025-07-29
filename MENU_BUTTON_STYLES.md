# Menu and Button Styling Reference

## MENU → BUTTON STATE MAPPING

### MENU STRUCTURE:
- **Container**: `bg-gray-900/90 border border-gray-700` (dark blue background, gray border)
- **Items**: Inherit container background unless specified

### STATE-BY-STATE MAPPING:

#### 1. NORMAL STATE
**MENU (non-selected items):**
- Background: Inherits `bg-gray-900/90` from container (dark blue)
- Border: Inherits `border border-gray-700` from container (gray border)
- Text: `text-gray-400` (gray text)

**BUTTONS SHOULD HAVE:**
- Background: `bg-gray-900/90` (dark blue - same as menu container)
- Border: `border border-gray-700` (gray border - same as menu container)
- Text: `text-gray-400` (gray text - same as menu items)

#### 2. HOVER STATE
**MENU (hovering over items):**
- Background: `hover:bg-gray-800/50` (lighter gray/blue, semi-transparent)
- Text: `hover:text-white` (white text)
- Border: Still has container border

**BUTTONS SHOULD HAVE:**
- Background: `hover:bg-gray-800/50` (lighter gray/blue - same as menu)
- Text: `hover:text-white` (white text - same as menu)
- Border: Still has `border-gray-700`

#### 3. ACTIVE/SELECTED STATE
**MENU (selected/active items):**
- Background: `bg-blue-600/20` (royal blue, semi-transparent)
- Text: `text-white` (white text)
- Border: `border-l-2 border-blue-400` (2px light blue left border)

**BUTTONS SHOULD HAVE (on click):**
- Background: `active:bg-blue-600/20` (royal blue - same as menu)
- Text: `active:text-white` (white text - same as menu)
- Border: `active:border-l-2 active:border-l-blue-400` (light blue left - same as menu)

## COLOR SUMMARY:
- **Dark blue background**: `bg-gray-900/90`
- **Gray border**: `border-gray-700`
- **Gray text**: `text-gray-400`
- **Lighter gray/blue hover**: `bg-gray-800/50`
- **White text**: `text-white`
- **Royal blue active**: `bg-blue-600/20`
- **Light blue border**: `border-blue-400`

## COMPLETE BUTTON CLASS STRING:
```
className="bg-gray-900/90 border border-gray-700 text-gray-400 hover:bg-gray-800/50 hover:text-white active:bg-blue-600/20 active:text-white active:border-l-2 active:border-l-blue-400 transition-all"
```

## SPECIAL CASE - EMAIL BUTTON:
**Normal/Hover/Active**: Same as above
**After clicking (copied state)**: `bg-green-600 text-white` (solid green, white text)
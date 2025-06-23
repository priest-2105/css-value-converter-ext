<div align="center">
  <img src="icon.png" width="128" height="128" alt="CSS Units Converter Icon">
  <h1>CSS Units Converter</h1>
  <p>Instantly convert CSS units like px, rem, vh, vw, and more on hover. A must-have tool for responsive web development.</p>
</div>

---

## ✨ Features

- **Multi-Unit Conversion**: Hover over a value to see all relevant conversions.
- **Rich Hover Info**: Tooltips include icons, context, and conversion details.
- **Wide Range of Units**: Supports `px`, `rem`, `em`, `vh`, `vw`, `%`, `pt`, `cm`, `mm`, and `in`.
- **Configurable**: Customize base font size and viewport dimensions to match your project.
- **Lightweight**: Activates only for `.css` files and has minimal overhead.

---

## ⚙️ Extension Settings

You can customize the conversion settings in your VS Code `settings.json` file:

```json
{
  "cssUnitsConverter.baseFontSize": 16,
  "cssUnitsConverter.viewportHeight": 900,
  "cssUnitsConverter.viewportWidth": 1440
}
```

- **`cssUnitsConverter.baseFontSize`**: The base font size in pixels for `rem` and `em` conversions (default: `16`).
- **`cssUnitsConverter.viewportHeight`**: The viewport height for `vh` conversions (default: `900`).
- **`cssUnitsConverter.viewportWidth`**: The viewport width for `vw` conversions (default: `1440`).

---

## 📋 Supported Units

The extension supports conversions between the following units:

- ✅ `px`
- ✅ `rem`
- ✅ `em`
- ✅ `vh`
- ✅ `vw`
- ✅ `%` (context-dependent)
- ✅ `pt`
- ✅ `cm`
- ✅ `mm`
- ✅ `in`

---

## 📜 Release Notes

### 0.0.3
- Update Readme

### 0.0.2
- Added a beautiful icon for the extension.
- Enhanced README with detailed information and visuals.

### 0.0.1
- Initial release with hover-based conversions for major CSS units.

---

## 📄 License

This extension is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

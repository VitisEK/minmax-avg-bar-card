# Min/Max/Avg Bar Card

[![](https://img.shields.io/github/release/VitisEK/minmax-avg-bar-card/all.svg?style=for-the-badge)](https://github.com/VitisEK/minmax-avg-bar-card/releases)
[![hacs_badge](https://img.shields.io/badge/HACS-Default-41BDF5.svg?style=for-the-badge)](https://github.com/hacs/integration)
[![](https://img.shields.io/github/license/VitisEK/minmax-avg-bar-card?style=for-the-badge)](LICENSE)
[![](https://img.shields.io/badge/MAINTAINER-%40VitisEK-red?style=for-the-badge)](https://github.com/VitisEK)
[![](https://img.shields.io/badge/GitHub%20Sponsors-SUPPORT-EA4AAA?style=for-the-badge&logo=githubsponsors&logoColor=white)](https://github.com/sponsors/VitisEK)
[![](https://img.shields.io/badge/COMMUNITY-FORUM-success?style=for-the-badge)](https://community.home-assistant.io)



# MIN/MAX/AVG bar card (Lovelace)

A custom Lovelace card for Home Assistant that renders **min / max / average** statistics as an Energy-style bar chart.
It uses **Long-Term Statistics** (Recorder) to show hourly, daily, weekly, or monthly bins and supports CZ/EN labels.
![Example](./img/screenshot.png)

## How data is displayed

*   **One bar per bin**: Each bar represents the **min to max** range for a selected bin (hour/day/week/month).
*   **Average line**: A thin line inside the bar marks the **average** value for the same bin.
*   **Color by max**: Bar color is chosen by comparing the **max** value to your threshold ranges.
*   **Gaps for missing stats**: If Recorder has no data for a bin, that bin is left empty.
*   **Dynamic labels**: X labels adapt to the selected period and locale.
*   **Energy date sync**: When enabled, the card follows the Energy dashboard time selection.

## Features

*   **Energy Dashboard Look**: SVG chart styled to match Home Assistant's Energy UI.
*   **Min/Max/Avg Bars**: Min/Max as a colored bar, Avg as a line.
*   **Period Support**: Hour / Day / Week / Month bins (configurable).
*   **Month Toggle**: When period is long, switch between Month and Week bins.
*   **Threshold Colors**: Color ranges based on the **max** value (custom or preset).
*   **Preset Color Scales**: Temperature and Wind (Beaufort) templates, plus custom thresholds.
*   **Energy Date Sync**: Optionally follows Energy dashboard date selection.
*   **Energy Compare Overlay**: When Energy dashboard compare is enabled, overlays the comparison period bars.
*   **Shared Month/Week Toggle**: Optional shared toggle across cards.
*   **Visual Editor**: Configurable via the Lovelace UI editor.

## Installation

### HACS (Recommended)

1.  Open **HACS** in Home Assistant.
2.  Go to **Frontend**.
3.  Click the menu (three dots) in the top right corner -> **Custom repositories**.
4.  Add the URL of this repository: `https://github.com/VitisEK/minmax-avg-bar-card`.
5.  Select category: **Lovelace**.
6.  Click **Add** and then install the card.
7.  Reload resources (or restart HA).

### Manual Installation

1.  Download `minmax-avg-bar-card.js` from the Releases page.
2.  Upload the file to your Home Assistant `config/www/` directory.
3.  Add the resource in **Settings** -> **Dashboards** -> **Three dots** -> **Resources**:
    *   URL: `/local/minmax-avg-bar-card.js`
    *   Type: `JavaScript Module`

## Usage

### Basic

```yaml
type: custom:minmax-avg-bar-card
name: Room Temperature
entity: sensor.living_room_temperature
```

### With a preset (Temperature)

```yaml
type: custom:minmax-avg-bar-card
name: Outdoor Temperature
entity: sensor.outdoor_temperature
preset: temperature
```

### Wind (Beaufort) preset

```yaml
type: custom:minmax-avg-bar-card
name: Wind Speed
entity: sensor.wind_speed
preset: beaufort
```

### Custom thresholds and colors

```yaml
type: custom:minmax-avg-bar-card
name: Custom Range
entity: sensor.custom_value
thresholds:
  - lt: 10
    color: "#039be5"
  - lt: 20
    color: "#43a047"
  - lt: 30
    color: "#fdd835"
  - lt: 999
    color: "#e53935"
```

### Period selection and labels

```yaml
type: custom:minmax-avg-bar-card
name: Daily Stats
entity: sensor.temperature
default_ws_period: day
show_x_labels: true
show_y_labels: true
show_y_unit: true
```

### Follow Energy Dashboard date selection

```yaml
type: custom:minmax-avg-bar-card
name: Energy Temperature
entity: sensor.temperature
listen_energy_date_selection: true
```

## Configuration

The card supports the visual editor. Add **Min/Max/Avg Bar Card** to your dashboard and configure it via the UI.

### YAML Configuration

```yaml
type: custom:minmax-avg-bar-card
name: Min/Max/Avg
entity: sensor.temperature
height: 320
decimals: 1
y_padding_ratio: 0.08
preset: temperature # temperature | beaufort
thresholds:
  - lt: -15
    color: "#b968f4"
  - lt: 0
    color: "#039be5"
  - lt: 20
    color: "#43a047"
  - lt: 25
    color: "#fdd835"
  - lt: 30
    color: "#fb8c00"
  - lt: 999
    color: "#e53935"
show_x_labels: true
show_y_labels: true
show_y_unit: true
bar_radius: 4
default_ws_period: day # hour | day | week | month
listen_energy_date_selection: true
shared_period_mode: false
language: cs # cs | en
debug: false
```

## Notes

*   The entity must have **Long-Term Statistics** available.
*   Threshold colors are selected by comparing the **max** value to `lt` ranges.

## Changelog

### v1.2.0

*   Add Energy **compare** support (uses Energy datepicker compare range).
*   Render compare bars **side-by-side** with main bars, using the same color scale.
*   Show **average line** inside compare bars (reduced opacity).
*   Tooltip shows **current vs compare** values side-by-side with period headers.
*   Optional shared Month/Week toggle across cards (`shared_period_mode`).

### v1.1.0 ([PR #1](https://github.com/VitisEK/minmax-avg-bar-card/pull/1))

*   Add `color_by` option to control bar coloring method.
*   Reorder tooltip to show max on top, min on bottom.
*   Add Fahrenheit temperature preset and international date format.

Thanks to contributor **[@sxdjt](https://github.com/sxdjt)** for these improvements.

## Support

If you run into issues or have a feature request, please open an issue here:
https://github.com/VitisEK/minmax-avg-bar-card/issues

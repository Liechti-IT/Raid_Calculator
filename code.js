function calculateRAID() {
    const numDrives = parseInt(document.getElementById('numDrives').value);
    const driveSize = parseInt(document.getElementById('driveSize').value);
    const raidLevel = parseInt(document.getElementById('raidLevel').value);
  
    if (isNaN(numDrives) || isNaN(driveSize) || numDrives <= 0 || driveSize <= 0) {
      document.getElementById('result').innerText = 'Bitte geben Sie eine gültige Anzahl und Größe der Festplatten ein.';
      return;
    }
  
    let totalCapacity;
    if (raidLevel === 0) {
      totalCapacity = numDrives * driveSize;
    } else if (raidLevel === 1) {
      totalCapacity = driveSize;
    } else if (raidLevel === 5) {
      totalCapacity = (numDrives - 1) * driveSize;
    } else if (raidLevel === 10) {
      totalCapacity = (numDrives / 2) * driveSize;
    } else {
      document.getElementById('result').innerText = 'Ungültiges RAID-Level ausgewählt.';
      return;
    }
  
    document.getElementById('result').innerText = `Gesamtkapazität: ${totalCapacity} GB`;
  }
  
function showRaidInfo() {
    const raidLevel = parseInt(document.getElementById('raidLevel').value);
    let raidInfo = '';
  
    if (raidLevel === 0) {
      raidInfo = '<strong>RAID 0:</strong></br>RAID 0 kombiniert die Speicherkapazität mehrerer Festplatten, um die Leistung zu erhöhen, indem Daten auf mehrere Laufwerke verteilt werden. Es bietet jedoch keine Redundanz, d.h., ein Festplattenausfall führt zum Datenverlust.';
    } else if (raidLevel === 1) {
      raidInfo = '<strong>RAID 1:</strong></br>RAID 1 spiegelt Daten auf zwei Festplatten, um Redundanz und Datensicherheit zu bieten. Wenn eine Festplatte ausfällt, sind die Daten weiterhin auf der anderen Festplatte verfügbar.';
    } else if (raidLevel === 5) {
      raidInfo = '<strong>RAID 5:</strong></br>RAID 5 bietet Datenstriping wie RAID 0, aber mit Parity-Informationen, die über die Laufwerke verteilt sind. Dadurch können Daten auch nach einem Festplattenausfall wiederhergestellt werden.';
    } else if (raidLevel === 10) {
      raidInfo = '<strong>RAID 10:</strong></br>RAID 10 kombiniert die Leistung von RAID 0 mit der Redundanz von RAID 1. Die Festplatten werden in Spiegelsets aufgeteilt, und dann wird über diese Spiegelsets gestriped.';
    } else {
      raidInfo = 'Ungültiges RAID-Level ausgewählt.';
    }
  
    document.getElementById('raidInfo').innerHTML = raidInfo;
  
    // Aufruf der Funktion zur Erstellung des RAID-Layouts
    createRAIDLayoutSVG(parseInt(document.getElementById('numDrives').value), raidLevel);
  }
  
  document.getElementById('raidLevel').addEventListener('change', showRaidInfo);
  document.getElementById('driveSize').addEventListener('change', calculateRAID);
  document.getElementById('numDrives').addEventListener('change', showRaidInfo);
  document.getElementById('calculateButton').addEventListener('click', calculateRAID);
  
  // Initiale Anzeige des Info-Textes und des RAID-Layouts basierend auf der ausgewählten RAID-Konfiguration
  showRaidInfo();

  
// Funktion, um das RAID-Layout für RAID 0 grafisch darzustellen (SVG)
function createRAIDLayoutSVG(numDrives, raidLevel) {
    const raidLayoutDiv = document.getElementById('raidLayout');
    raidLayoutDiv.innerHTML = '';
  
    const svgWidth = 300;
    const svgHeight = 100;
    const diskWidth = 40;
    const diskHeight = 60;
    const diskMargin = 10;
    const raidMargin = 15;
  
    const totalWidth = raidMargin + numDrives * (diskWidth + diskMargin);
    const svgContainer = document.createElement('div');
    svgContainer.style.display = 'flex';
    svgContainer.style.flexWrap = 'wrap'; // Flex-Wrap hinzufügen
    svgContainer.style.width = totalWidth + 'px';
  
    for (let i = 0; i < numDrives; i++) {
      const driveColor = getDriveColor(raidLevel, i, numDrives);
  
      // SVG erstellen und Attribute festlegen
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('width', diskWidth);
      svg.setAttribute('height', diskHeight);
      svg.style.marginRight = `${diskMargin}px`;
      svg.style.marginBottom = `${diskMargin}px`;
  
      // Rechteck für Festplatte erstellen und Attribute festlegen
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('x', 0);
      rect.setAttribute('y', 0);
      rect.setAttribute('width', diskWidth);
      rect.setAttribute('height', diskHeight);
      rect.setAttribute('rx', 8);
      rect.setAttribute('ry', 8);
      rect.setAttribute('fill', driveColor);
  
      // Kreis für die "Disk" im Inneren erstellen
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      const circleRadius = 15;
      circle.setAttribute('cx', diskWidth / 2);
      circle.setAttribute('cy', diskHeight / 3); // Höhe des Kreises anpassen (hier 1/4 der Höhe)
      circle.setAttribute('r', circleRadius);
      circle.setAttribute('fill', '#176A5C');
  
      // Text für die Disk-Nummer erstellen und Attribute festlegen
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', diskWidth / 2);
      text.setAttribute('y', diskHeight / 2 + 20); // Position des Textes anpassen (hier 20 Pixel unterhalb der Mitte)
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('fill', '#104F44');
      text.setAttribute('font-size', '11px'); // Schriftgröße verkleinern
      text.setAttribute('font-weight', 'bold'); // Text fett machen
      text.textContent = `${i + 1}`;
  
      // Rechteck, Kreis und Text zur SVG hinzufügen und SVG zum Container hinzufügen
      svg.appendChild(rect);
      svg.appendChild(circle);
      svg.appendChild(text);
      svgContainer.appendChild(svg);
    }
  
    raidLayoutDiv.appendChild(svgContainer);
  }

  // Hilfsfunktion, um die Festplattenfarbe basierend auf dem RAID-Level und der Festplattenposition zu erhalten
  function getDriveColor(raidLevel, driveIndex, numDrives) {
    if (raidLevel === 0) {
      return '#26A790';
    } else if (raidLevel === 1) {
      return driveIndex === 0 ? '#26A790' : '#26A790';
    } else if (raidLevel === 5) {
      return driveIndex < numDrives - 1 ? '#26A790' : '#26A790';
    } else if (raidLevel === 10) {
      return driveIndex < numDrives / 2 ? '#26A790' : '#26A790';
    } else {
      return '#26A790'; // Standardfarbe für unbekannte RAID-Level
    }
  }
  
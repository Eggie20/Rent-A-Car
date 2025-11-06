// Chart wrapper
(function () {
  function initCharts(ctx, type, data, options) {
    if (!window.Chart) return null;
    return new Chart(ctx, { type, data, options });
  }
  function exportImage(canvas, filename = 'chart.png') {
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = filename;
    link.click();
  }
  window.initCharts = initCharts;
  window.exportChartImage = exportImage;
})();

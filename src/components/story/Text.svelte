<script>
  let { copy } = $props();

  function convertToHTML(text) {
    let finalText = [];
    let inList = false;
    if (text != undefined) {
      let textArray = text.split(/\n/);
      textArray.forEach(function (line) {
        line = line.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
        line = line.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
        line = line.replace(/\*([^*]+)\*/g, '<em>$1</em>');

        if (/^\s*[-*]\s+/.test(line)) {
          if (!inList) {
            finalText.push('<ul>');
            inList = true;
          }
          line = line.replace(/^\s*[-*]\s+(.*)/, '<li>$1</li>');
          finalText.push(line);
          return;
        } else if (inList) {
          finalText.push('</ul>');
          inList = false;
        }

        if (/^>\s+/.test(line)) {
          line = line.replace(/^>\s+(.*)/, '<blockquote>$1</blockquote>');
        }

        if (/[A-Za-z0-9]/.test(line)) {
          finalText.push(line);
        }
      });

      if (inList) {
        finalText.push('</ul>');
      }

      return wrapInPTags(finalText);
    }
  }

  function wrapInPTags(arr) {
    return arr
      .map(item => {
        if (/<\/?(ul|li|blockquote|div)(\s|>|$)/.test(item)) {
          return item;
        }
        if (item.trim() !== '') {
          return `<p>${item}</p>`;
        }
        return '';
      })
      .filter(item => item.trim() !== '')
      .join('');
  }
</script>

{@html convertToHTML(copy)}

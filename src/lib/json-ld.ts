/**
 * Serialise an object for injection into a <script type="application/ld+json">
 * block.
 *
 * `JSON.stringify` alone is NOT safe here. It escapes quotes and backslashes,
 * but it leaves `<`, `>` and `&` untouched, and none of those are JSON syntax —
 * they only ever appear inside string values. So a value containing
 * `</script><script>…</script>` closes the surrounding tag and the rest
 * executes as ordinary page script.
 *
 * That matters because the values in our JSON-LD come from the `restaurants`
 * row: name, address, categories and image_url are all columns a restaurant
 * operator can write from the portal, so the payload would arrive through a
 * normal product flow rather than an attack on the site itself.
 *
 * The replacements below are plain JSON string escapes. A parser decodes
 * `<` back to `<`, so the structured data a crawler reads is byte-for-byte
 * what it was before; only the HTML tokenizer sees the difference. U+2028 and
 * U+2029 are escaped too: they are valid inside a JSON string but are line
 * terminators in JavaScript, which breaks the script rather than the markup.
 */
export function jsonLdScript(value: unknown): string {
  return JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

import { defu } from 'defu'
import routerOptions from '#build/router.options.mjs'
const sensitiveMatcher = /* @__PURE__ */ (() => { const $0={},$1={redirect: "/place/**"}; return (m,p)=>{let r=[];if(p.charCodeAt(p.length-1)===47)p=p.slice(0,-1);if(p==="/__sitemap__/style.xsl"){r.push({data:$0});}else if(p==="/sitemap.xml"){r.push({data:$0});}else if(p.charCodeAt(p.length-1)===47){if(p==="/__sitemap__/style.xsl/"){r.push({data:$0});}else if(p==="/sitemap.xml/"){r.push({data:$0});}}let s=p.split("/");if(s.length>1&&s[s.length-1]===""){s.pop();p=p.slice(0,-1)}let l=s.length;if(l>1){if(s[1]==="view"){r.push({data:$1,params:{"_":p.slice(6),}});}}return r.reverse();}})()
const foldedMatcher = sensitiveMatcher
const decodeRoutePath = function decodeRoutePath(path) {
	if (!path.includes("%")) return path;
	const queryIndex = path.indexOf("?");
	const pathname = queryIndex === -1 ? path : path.slice(0, queryIndex);
	try {
		return queryIndex === -1 ? decodeURI(pathname) : decodeURI(pathname) + path.slice(queryIndex);
	} catch {
		return path;
	}
}
const normalizePath = (path, fold) => {
  if (typeof path !== 'string') { return path }
  const decoded = decodeRoutePath(path)
  return fold ? decoded.toLowerCase() : decoded
}
export default (path) => routerOptions.sensitive
  ? defu({}, ...sensitiveMatcher('', normalizePath(path, false)).map(r => r.data).reverse())
  : defu({}, ...foldedMatcher('', normalizePath(path, true)).map(r => r.data).reverse())
  
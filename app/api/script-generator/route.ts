import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// Validation schema for script generation
const scriptGeneratorSchema = z.object({
  selectionType: z.enum(['include', 'exclude']),
  domains: z.array(z.string()),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = scriptGeneratorSchema.parse(body)

    const { selectionType, domains } = validatedData

    // Generate the JavaScript code
    const script = generatePasteScript(selectionType, domains)

    return NextResponse.json({
      success: true,
      script,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation error',
          details: error.errors,
        },
        { status: 400 }
      )
    }

    console.error('Error generating script:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    )
  }
}

function generatePasteScript(selectionType: 'include' | 'exclude', domains: string[]): string {
  // Get the current domain (will be replaced with actual domain in production)
  const baseUrl = process.env.NEXTAUTH_URL || process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'

  const script = `
(function() {
    // PasteScript Auto-Converter
    // Generated for ${selectionType === 'include' ? 'including' : 'excluding'} domains: ${domains.join(', ')}
    
    var pasteScriptConfig = {
        baseUrl: '${baseUrl}',
        selectionType: '${selectionType}',
        domains: ${JSON.stringify(domains)},
        apiToken: null, // Optional: Add API token for authenticated requests
        debug: false
    };

    // Utility functions
    function log(message) {
        if (pasteScriptConfig.debug) {
            console.log('[PasteScript]', message);
        }
    }

    function getHostName(url) {
        try {
            var link = document.createElement('a');
            link.href = url;
            return link.hostname.toLowerCase();
        } catch (e) {
            return null;
        }
    }

    function matchesWildcardDomain(hostname, pattern) {
        if (pattern.startsWith('*.')) {
            var domain = pattern.substring(2);
            return hostname === domain || hostname.endsWith('.' + domain);
        }
        return hostname === pattern;
    }

    function shouldConvertDomain(hostname) {
        var matches = false;
        
        for (var i = 0; i < pasteScriptConfig.domains.length; i++) {
            if (matchesWildcardDomain(hostname, pasteScriptConfig.domains[i])) {
                matches = true;
                break;
            }
        }

        if (pasteScriptConfig.selectionType === 'include') {
            return matches;
        } else {
            return !matches;
        }
    }

    function base64Encode(str) {
        return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) {
            return String.fromCharCode(parseInt(p1, 16));
        }));
    }

    function extractPasteId(url) {
        // Common paste URL patterns for popular paste services
        var patterns = [
            // Pastebin patterns
            /pastebin\\.com\\/([a-zA-Z0-9]+)\\/?$/,
            /pastebin\\.com\\/raw\\/([a-zA-Z0-9]+)/,
            
            // Hastebin patterns  
            /hastebin\\.com\\/([a-zA-Z0-9]+)/,
            /hastebin\\.com\\/raw\\/([a-zA-Z0-9]+)/,
            
            // GitHub Gist patterns
            /gist\\.github\\.com\\/[^/]+\\/([a-f0-9]+)/,
            
            // Dpaste patterns
            /dpaste\\.com\\/([a-zA-Z0-9]+)/,
            
            // Generic paste patterns
            /\\/paste\\/([a-zA-Z0-9]+)/,  // some-site.com/paste/ABC123
            /\\/p\\/([a-zA-Z0-9]+)/,      // some-site.com/p/ABC123
            /\\/([a-zA-Z0-9]+)\\.txt$/,   // some-site.com/ABC123.txt
            /\\/([a-zA-Z0-9]{6,})\\/?$/,  // Generic: at least 6 chars at end of URL
            /id=([a-zA-Z0-9]+)/,          // some-site.com?id=ABC123
        ];

        for (var i = 0; i < patterns.length; i++) {
            var match = url.match(patterns[i]);
            if (match && match[1] && match[1].length >= 4) { // Ensure minimum length
                return match[1];
            }
        }

        return null;
    }

    function convertPasteLink(originalUrl, pasteId) {
        var convertedUrl = pasteScriptConfig.baseUrl + '/' + pasteId + '?source=' + encodeURIComponent(originalUrl);
        
        if (pasteScriptConfig.apiToken) {
            convertedUrl += '&token=' + encodeURIComponent(pasteScriptConfig.apiToken);
        }

        return convertedUrl;
    }

    function processLinks() {
        var links = document.getElementsByTagName('a');
        var convertedCount = 0;

        for (var i = 0; i < links.length; i++) {
            var link = links[i];
            var href = link.getAttribute('href');
            
            if (!href || href.startsWith('#') || href.startsWith('javascript:') || href.startsWith('mailto:')) {
                continue;
            }

            var hostname = getHostName(href);
            if (!hostname) {
                continue;
            }

            if (shouldConvertDomain(hostname)) {
                var pasteId = extractPasteId(href);
                if (pasteId) {
                    var originalHref = href;
                    var convertedUrl = convertPasteLink(originalHref, pasteId);
                    
                    link.setAttribute('href', convertedUrl);
                    link.setAttribute('data-original-href', originalHref);
                    link.setAttribute('data-pastescript-converted', 'true');
                    
                    convertedCount++;
                    log('Converted: ' + originalHref + ' -> ' + convertedUrl);
                }
            }
        }

        log('Converted ' + convertedCount + ' paste links');
        return convertedCount;
    }

    // Initialize the converter
    function initPasteScriptConverter() {
        log('Initializing PasteScript converter...');
        log('Configuration: ' + JSON.stringify(pasteScriptConfig));

        // Process existing links
        processLinks();

        // Set up mutation observer for dynamically added links
        if (window.MutationObserver) {
            var observer = new MutationObserver(function(mutations) {
                var shouldProcess = false;
                
                mutations.forEach(function(mutation) {
                    if (mutation.type === 'childList') {
                        for (var i = 0; i < mutation.addedNodes.length; i++) {
                            var node = mutation.addedNodes[i];
                            if (node.nodeType === 1) { // Element node
                                if (node.tagName === 'A' || node.getElementsByTagName('a').length > 0) {
                                    shouldProcess = true;
                                    break;
                                }
                            }
                        }
                    }
                });

                if (shouldProcess) {
                    setTimeout(processLinks, 100); // Small delay to ensure DOM is ready
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            log('Mutation observer set up for dynamic content');
        }

        log('PasteScript converter initialized successfully');
    }

    // Start the converter when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPasteScriptConverter);
    } else {
        initPasteScriptConverter();
    }

    // Expose configuration for debugging
    window.PasteScriptConfig = pasteScriptConfig;
    window.PasteScriptReprocess = processLinks;

})();`.trim()

  return script
}

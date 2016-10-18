/**
    Module: @mitchallen/fuse-svg-path
    Author: Mitch Allen
*/

/*jshint esversion: 6 */

"use strict";

module.exports.create = function (spec) {
    if(!spec) {
        return null;
    }
    // private 
    let _package = "@mitchallen/fuse-svg-path";
    return {
        // public 
        package: function() {
            return _package;
        },
        health: function() {
            return "OK";
        },
        fuse: function(options) {

            if(!options) {
                console.error("ERROR: fuse() called with no options");
                return null;
            }

            if(!options.path) {
                console.error("ERROR: fuse() called with no path");
                return null;
            }

            let verbose = options.verbose || false;

            var sourcePath = options.path,
                pathList = [],
                pIndex = pathList.length,
                op = null,
                x = 0,
                y = 0;

            for(var tKey in sourcePath) {
                var pt = sourcePath[tKey];
                op = pt.op;
                x = pt.x;
                y = pt.k;
                if( op == "M" ) {
                    pathList.push([]);
                    pIndex = pathList.length - 1;
                }
                pathList[pIndex].push(pt);
            }

            // Dump Path List

            var dumpPathList = function() {
                for(var pKey in pathList ) { 
                    console.log("===========================");
                    var path = pathList[pKey];
                    console.log( path );
                    var first = path[0];
                    var last = path[path.length-1];
                    console.log("FIRST: " , first, ", LAST: ", last );
                }
            };

            if(verbose) {
                console.log("*** ORIGINAL PATH LIST");
                dumpPathList();
            }

            var getFuseEnd = function() {
                return pathList[0][pathList[0].length - 1];
            };

            var fuseEnd = getFuseEnd();

            // TODO - use something better to determine loop end
            for( var temp = 0; temp < 4; temp++ ) {

                for(var fKey in pathList ) {
                    if( fKey < 1 ) {    // Ignore lint checker 
                        // We will fuse on to path[0]
                        continue;
                    }
                    var path = pathList[fKey];
                    var first = path[0];
                    var last = path[path.length-1]; 
                    if( last.op == "X" ) {
                        // Already fused
                        continue;
                    }
                    if( first.x == fuseEnd.x && first.y == fuseEnd.y ) {
                        for( var sKey in path ) {
                            if( sKey < 1 ) {    // Ignore lint checker
                                // Drop matching M
                                // TODO - mark as trash
                                pathList[fKey].push( { op: "X" } );
                                continue;
                            }
                            pathList[0].push(path[sKey]);
                        }
                        fuseEnd = getFuseEnd();
                    }
                } 
            }

            if(verbose) {
                console.log("\n\n*** FUSED PATH LIST");
                dumpPathList();
                console.log( "\n\n ===> PATH LIST [0]: \n", pathList[0] );
            }

            var fusedPath = [];

            for( var xKey in pathList[0]) {
                fusedPath.push( pathList[0][xKey] );
            }

            return fusedPath;
        }
    }; 
};

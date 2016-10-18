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
            let MAX_VALVE = options.maxValve || 1000; 

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
                    // pathList.push([]);
                    pathList.push({ trash: false, path: [] });
                    pIndex = pathList.length - 1;
                }
                pathList[pIndex].path.push( pt );
            }

            // Dump Path List

            var dumpPathList = function() {
                for(var pKey in pathList ) { 
                    console.log("===========================");
                    var path = pathList[pKey].path;
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

            var fPath = []; // fused path

            var getFuseEnd = function() {
                return fPath[fPath.length - 1];
            };

            var trashCount = 0;
            var safetyValve = 0;

            // Init fused path with first path

            for(var zKey in pathList[0].path) {
                var record = pathList[0].path[zKey];
                fPath.push( record );
            }

            var fEnd = getFuseEnd();

            do {

                trashCount = 0;

                for(var fKey in pathList ) {

                    if( fKey < 1 ) {    // Ignore lint checker 
                        // We will fuse on to path[0]
                        continue;
                    }
                    var record = pathList[fKey];
                    if( record.trash === true ) {
                        // Trash: already fused
                        continue;
                    }

                    var path = record.path;
                    var first = path[0];
                    var last = path[path.length-1]; 

                    if( last.x == fEnd.x && last.y == fEnd.y ) {
                        // Reverse in place
                        pathList[fKey].path.reverse(); 
                        // Reset values for reversed path
                        path = pathList[fKey].path;
                        first = path[0];
                        first.op = "M";
                        last = path[path.length-1];
                        last.op = "L";
                    }

                    if( first.x == fEnd.x && first.y == fEnd.y ) {
                        for( var sKey in path ) {
                            if( sKey < 1 ) {    // Ignore lint checker
                                // mark as trash to be ignored
                                pathList[fKey].trash = true;
                                trashCount++;   
                                continue;
                            }

                            fPath.push(path[sKey]);
                        }
                        fEnd = getFuseEnd();
                    } 
                } 

                if(verbose) {
                    console.log("TRASH COUNT:", trashCount );
                }

            } while( trashCount > 0 && ++safetyValve < MAX_VALVE );

            if( safetyValve >= MAX_VALVE ) {
                console.log(
                    "SAFETY VALVED BLOWN:\n",
                    "Trying setting / increasing fuse(option.maxValve)\n",
                    "Current value: ", MAX_VALVE);
                return null;
            }

            if(verbose) {
                console.log("\n\n*** FUSED PATH LIST");
                dumpPathList();
                console.log( "\n\n ===> PATH LIST [0]: \n", pathList[0] );
            }

            for(var lKey in pathList ) {
                if( lKey < 1 ) {
                    continue;
                }
                record = pathList[lKey]
                if( record.trash ) {
                    continue;
                }
                for( var rpKey in record.path ) {
                    fPath.push(path[rpKey]);
                }
            }

            return fPath;
        }
    }; 
};

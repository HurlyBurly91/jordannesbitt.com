# M09-R8 — Explicit colour decision and ready editor checkpoint

Intermediate technical evidence, **not M09 completion or owner content/colour/rights/usability acceptance**. Current feedback identifies repeated CLI missingICC errors and a half-failed/buried editor. Correction preserves canonical schemas,ingestion,colour handling,private storage,publication/export/release and public presentation.

## IDs and scope

M09-R8-01–09/P01/P02/D01/D02/V01 technically verified;10/V02 record sequence/transport/human pointer. H01 requires owner ordinary-image decision/edit/save/restart review; older R7/R6/R1/R5 human/source/colour/final-content/manual checks persist. M09-R7-01 pending-editor timing is SUPERSEDED by R8-04 only,not silent removal of other image-first behavior or final approval.

Readonly profile-question adapter uses existing direct sharp100Mpixel/single-image checks and30MiBbounded authenticated selected bytes. It returns checksum/profile presence only and creates no inputcopies/jobs/drafts/registry allocation/default. The actual ingestion pipeline revalidates/converts/encodes as before; no second colour model/auto white-balance/crop/profile correction/new assumption. Existing guard/token/Host/Origin/path/export authority reused,not expanded. LOW workflow correction.

## Corrected flow

Select→readonlyinspect→“This image has no embedded colour profile. Most web exports use sRGB.”→explicit Use sRGB for this image / Choose another image. Optional explanation distinguishes interpretation from physical-art colour approval. Untagged decisions are per current selected file; explicit batchcheckbox names/counts allcurrentlyselecteduntaggedimages only. Choices reset on new selection,cancel/completion; no global future-import memory. Tagged inputs skip unnecessary question; decline creates no artwork or failedjob.

Owner-approved image gets existing assumeSrgb option; private manifest records explicit-sRGB versus embedded-to-sRGB interpretation. Pipeline failure stays failure; no half-complete editable item. Complete image/record alone opens editor,first ahead of gallery/progress,scrolls tocurrentviewport andfocusesTitle. Commonfields editable withoutAdvanced. Save/Preview showreadiness besidebothcontrolgroups;required chosen date/dimension/edition/photo constraints remain explicit whileoptional facts/private unknownlabels maystayempty. Old CLIerrors translate tohumanreason;currentprogress deduplicates equal Preparing/Ready/Failed groups and doesn'trender olderrorhistory repeatedly. Rawprivate jobevidence retained,notpurged to claimsuccess.

## Verification

Linux/Node22.23.3/npm10.9.9/Astro5.18.2/sharp0.35.5/Playwright1.63.0/Chromium153.0.8010.12/axe4.13.0.

```bash
npm_config_cache=/tmp/opencode/jordannesbitt-npm-cache ASTRO_TELEMETRY_DISABLED=1 npm exec --yes --package=node@22.23.3 --package=npm@10.9.9 --call 'npm run verify'
JORDANNESBITT_M09_DATA=/home/jordan/.local/share/jordannesbitt-art/m09 npm_config_cache=/tmp/opencode/jordannesbitt-npm-cache ASTRO_TELEMETRY_DISABLED=1 npm exec --yes --package=node@22.23.3 --package=npm@10.9.9 --call 'npm run studio:intake-demo'
npm_config_cache=/tmp/opencode/jordannesbitt-npm-cache ASTRO_TELEMETRY_DISABLED=1 npm exec --yes --package=node@22.23.3 --package=npm@10.9.9 --call 'npm run release:check'
```

TargetedStudio11/11pass;full **83/83tests,0fail/skip/diagnostics**,previous80checksretained. Newcases verify readonlyprofile noallocation,untagged explicitdecision/completefocus-scroll/editor/minimalprivateSave/exact-date disabledreason/actualserverrestartmetadata persistence;decline/embeddedICC skip/batchscope/futuredecisionreset/duplicateerror suppression. Native selectedoriginal bytes+mtime unchanged;canonicalpipeline manifests explicit versus embeddedprofile arechecked. Existing publication/rights/defaultwrite-disabled/dryrun/syntheticapprovedexport/rollback/security/path/symlink/corrupt/interrupted/preview-search-sitemap and publica11y/budget tests remain green.

Exactpublicsrc/schema/canonicalingest/colour/export/path/preview/release preservation diff exits0 before checkpoint. Actualpublicoutput13pages/0images/maxJS2049bytesgzip and content/search empty. Strictrelease exits1/**BLOCKED_CONTENT**,same8missingownercontent issues. Existing nonpassing dependency audit unchanged,not newly calledpassing.

## Private real-image sequence

Exact authorized snapshotSHA25660d841eaabd3a7e1ced4560c047c863fcba111f8b89ccc4f7f0d664cd66b8a2c. Single actualuntagged image;isolatedpersistentworkspace/registrycopy avoids owner workingdata changes. Artifact:

`/home/jordan/.local/share/jordannesbitt-art/m09/studio/demonstrations/intake-demo-2026-10-06T07-58-30-335Z-326c6270`

Six sequence steps/twelveviewport-fullPNGfiles: Selectimage;explicitprofilechoice;completefocusededitor;Title/Medium/Alt edits;Saveprivate;actualserverstop/start/reopenpersistedvalues. `studio:intake-demo` exits0,0observedaxeviolations/incomplete/reflow at1440×900CSSpx/DPR1/normalzoom. Actualreadonlyquestion creates0jobs/drafts;manifestexplicit-sRGBprofile;defaultdateunknown/dimensions-offers-editions-availabilityunsupplied/kindunclassified/publishedfalse/sourceapprovalabsent. Temporary UIlabel/mediumhint/alttext are demonstration-only,not permanent artisticfacts. Screenshotquestion/ready/restart inspected.

AuthoritativeownerStudio state/registry byte-for-byteunchanged;169/169sourcebytes+mtimepreserved. Allrealimages/draftrecords/notes/manifests/screenshots/reports/private source data stay underpersistentM09root,outsideGit. No real sourcewrites/rightsapproval,manifestapproval,master/deploy/services effects. No physical-artcolour/fullWCAG/real-device/humanusability approval inferred.

## Human handoff

Fromcheckout/Node22,`npm run studio` opens ownerStudio on127.0.0.1;defaultsourcewritingdisabled and existingpersistentworkingdata unchanged. Open artifactREADME/report/screenshots for exact sequence;`JORDANNESBITT_M09_DATA=<artifact>/workspace npm run studio` opens isolated saved demonstration. studio/README.md/docs/studio.md record profile-question scope/readiness and unchanged final export gates. Ownerrepeats ordinaryuntagged/tagged/batchchoice/edit/save/restart andreviews remaining realcolour/rights/publiccontent/launch gates. Return ACTIVE/HUMAN_VERIFICATION,neverCOMPLETE/finalcloseout.

#!/usr/bin/env sh
RESET='\033[0m'
YELLOW='\033[0;33m'
GRAY='\033[1;90m'

GLOBAL_RETURN=

FAKERUN() {
    echo -e "$YELLOW\$$RESET $GRAY$@$RESET" >&2
}
RUN() {
    FAKERUN $@
    eval $@
}
RUN_WITH_RETURN() {
    FAKERUN $@
    GLOBAL_RETURN=`eval $@`
}

case "$1" in
i | install)
    RUN "$0 install-tool"
    RUN "$0 install-web"
;;
install-tool)
    RUN mkdir .hanmo 2>/dev/null || true
    RUN curl https://github.com/mc-kor/hanmo-combinator/releases/download/main/hanmo-combinator -L -o ./.hanmo/hanmo-combinator
    RUN chmod +x .hanmo/hanmo-combinator
;;
install-web)
    RUN '(cd www; npm install)'
;;
install-tool-raw)
    RUN cargo +nightly install --git https://github.com/mc-kor/hanmo-combinator
    RUN '(cd www; npm install)'
;;
p | preview)
    RUN '(cd www; npm run preview)'
;;
r | resourcepack)
    RUN '(cd www; npm run copy-to-resourcepack)'
;;
download-corpus)
    RUN_WITH_RETURN 'curl https://launchermeta.mojang.com/mc/game/version_manifest.json'
    snapshot=`echo $GLOBAL_RETURN | jq '.latest.snapshot'`
    snapshot_url=`echo $GLOBAL_RETURN | jq -r ".versions[] | select(.id == $snapshot).url"`
    echo "Minecraft: $snapshot ($snapshot_url)"
    RUN_WITH_RETURN "curl $snapshot_url"
    asset_index_url=`echo $GLOBAL_RETURN | jq '.assetIndex.url'`
    RUN_WITH_RETURN "curl $asset_index_url"
    asset_hash=`echo $GLOBAL_RETURN | jq -r '.objects."minecraft/lang/ko_kr.json".hash'`
    RUN "mkdir .hanmo 2>/dev/null || true"
    RUN "curl https://resources.download.minecraft.net/${asset_hash:0:2}/$asset_hash -o ./.hanmo/ko_KR.json"
;;
c | coverage)
    RUN 'node scripts/coverage.mjs'
;;
build)
    RUN ./.hanmo/hanmo-combinator
;;
build-web)
    RUN '(cd www; npm run build && npm run bundle)'
;;
*)
    echo "unknown command '$0 $1'"
    echo "$0 i or install      - install required toolchain"
    echo "$0 install-raw       - install required toolchain (from main branch, directly)"
    echo "$0 p or preview      - start preview server"
    echo "$0 r or resourcepack - copy out.zip to resourcepack for in-game preview"
    echo "$0 download-corpus   - download Minecraft latest snapshot corpus for coverage report"
    echo "$0 build-web         - build website, just for ci"
;;
esac

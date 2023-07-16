#!/usr/bin/env sh
RESET='\033[0m'
YELLOW='\033[0;33m'
GRAY='\033[1;90m'

GLOBAL_RETURN=

ECHO() {
    echo -e $@ >&2
}
FAKERUN() {
    ECHO "$YELLOW\$$RESET $GRAY$@$RESET"
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
    RUN curl https://github.com/jqlang/jq/releases/download/jq-1.6/jq-linux64 -L -o ./.hanmo/jq
    RUN chmod +x .hanmo/jq
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
    snapshot=`echo $GLOBAL_RETURN | ./.hanmo/jq '.latest.snapshot'`
    snapshot_url=`echo $GLOBAL_RETURN | ./.hanmo/jq -r ".versions[] | select(.id == $snapshot).url"`
    echo "Minecraft: $snapshot ($snapshot_url)"
    RUN_WITH_RETURN "curl $snapshot_url"
    asset_index_url=`echo $GLOBAL_RETURN | ./.hanmo/jq '.assetIndex.url'`
    RUN_WITH_RETURN "curl $asset_index_url"
    asset_hash=`echo $GLOBAL_RETURN | ./.hanmo/jq -r '.objects."minecraft/lang/ko_kr.json".hash'`
    RUN "mkdir .hanmo 2>/dev/null || true"
    RUN "curl https://resources.download.minecraft.net/`echo $asset_hash | awk '{ print substr($1, 0, 2) }'`/$asset_hash -o ./.hanmo/ko_KR.json"
;;
c | coverage)
    if git diff-files --quiet; then
        ECHO "working directory clean; diffing with previous commit."
        RUN "git worktree add ./.previous -b previous HEAD^ --no-checkout"
    else
        ECHO "working directory dirty; diffing with current commit."
        RUN "git worktree add ./.previous -b previous HEAD --no-checkout"
    fi
    RUN "git -C ./.previous checkout HEAD src"
    RUN "(cd ./.previous/ && ../.hanmo/hanmo-combinator)"
    RUN 'node scripts/commands/coverage/main.mjs'
    RUN "git worktree remove ./.previous -f"
    RUN "git worktree prune"
    RUN "git branch -D previous >&2"
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
    echo "$0 install-tool-raw  - install required toolchain (from main branch, directly)"
    echo "$0 p or preview      - start preview server"
    echo "$0 r or resourcepack - copy out.zip to resourcepack for in-game preview"
    echo "$0 download-corpus   - download Minecraft latest snapshot corpus for coverage report"
    echo "$0 c or coverage     - create coverage report"
    echo "$0 build             - build the hexfont"
    echo "$0 build-web         - build website, just for ci"
;;
esac

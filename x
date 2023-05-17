#!/usr/bin/env sh
RESET='\033[0m'
YELLOW='\033[0;33m'
GRAY='\033[1;90m'

FAKERUN() {
    echo -e "$YELLOW\$$RESET $GRAY$@$RESET"
}
RUN() {
    FAKERUN $@
    eval $@
}

case "$1" in
i | install)
    RUN cargo +nightly install --git https://github.com/mc-kor/hanmo-combinator
    RUN '(cd www; npm install)'
;;
p | preview)
    RUN '(cd www; npm run preview)'
;;
build-web)
    RUN '(cd www; npm run build)'
;;
*)
    echo "unknown command '$0 $1'"
    echo "$0 i or install - install required toolchain"
    echo "$0 p or preview - start preview server"
    echo "$0 build-web    - build website, just for ci"
;;
esac

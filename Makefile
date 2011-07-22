# Makefile to start Titanium Mobile project from the command line.
# More info at http://github.com/guilhermechapiewski/titanium-jasmine

PROJECT_NAME=joliDemo
PROJECT_ROOT=$(shell pwd)

run-iphone:
	@DEVICE_TYPE=iphone make run

run-ipad:
	@DEVICE_TYPE=ipad make run

run:
	@if [ "${DEVICE_TYPE}" == "" ]; then\
		echo "Please run \"make run-[iphone|ipad]\" instead.";\
		exit 1;\
	fi
	@make launch-titanium

clean:
	@rm -rf ${PROJECT_ROOT}/build/iphone/*
	@mkdir -p ${PROJECT_ROOT}//build/iphone/
	@echo "Deleted: ${PROJECT_ROOT}/build/iphone/*"

launch-titanium:
	@echo "Building with Titanium... (DEVICE_TYPE:${DEVICE_TYPE})"
	@mkdir -p ${PROJECT_ROOT}/build/iphone/
	@PROJECT_NAME=${PROJECT_NAME} PROJECT_ROOT=${PROJECT_ROOT} DEVICE_TYPE=${DEVICE_TYPE} bash ${PROJECT_ROOT}/bin/titanium.sh
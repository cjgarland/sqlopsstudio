/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';

import { TPromise } from 'vs/base/common/winjs.base';
import { IWindowService } from 'vs/platform/windows/common/windows';
import { MainThreadWindowShape, ExtHostWindowShape, ExtHostContext, MainContext, IExtHostContext } from '../node/extHost.protocol';
import { IDisposable, dispose } from 'vs/base/common/lifecycle';
import { extHostNamedCustomer } from 'vs/workbench/api/electron-browser/extHostCustomers';
import { latch } from 'vs/base/common/event';

@extHostNamedCustomer(MainContext.MainThreadWindow)
export class MainThreadWindow implements MainThreadWindowShape {

	private readonly proxy: ExtHostWindowShape;
	private disposables: IDisposable[] = [];

	constructor(
		extHostContext: IExtHostContext,
		@IWindowService private windowService: IWindowService
	) {
		this.proxy = extHostContext.getProxy(ExtHostContext.ExtHostWindow);

		latch(windowService.onDidChangeFocus)
			(this.proxy.$onDidChangeWindowFocus, this.proxy, this.disposables);
	}

	$getWindowVisibility(): TPromise<boolean> {
		return this.windowService.isFocused();
	}

	dispose(): void {
		this.disposables = dispose(this.disposables);
	}
}

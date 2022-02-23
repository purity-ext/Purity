//
//  ExtensionState.swift
//  Purity
//
//  Created by Helloyunho on 2022/02/23.
//

import Foundation
#if os(macOS)
import SafariServices
#endif

let extensionBundleIdentifier = "xyz.helloyunho.Purity.Extension"

enum ExtensionState {
    case unknown
    case disabled
    case enabled
    
    static func getState() async -> ExtensionState {
        #if os(macOS)
            do {
                let state = try await SFSafariExtensionManager.stateOfSafariExtension(withIdentifier: extensionBundleIdentifier)
                if state.isEnabled {
                    return .enabled
                } else {
                    return .disabled
                }
            } catch {
                return .unknown
            }
        #else
            return .unknown
        #endif
    }
}

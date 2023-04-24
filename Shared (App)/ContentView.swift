//
//  ContentView.swift
//  Purity
//
//  Created by Helloyunho on 2022/02/23.
//

import SwiftUI

struct ContentView: View {
    @State var extensionState: ExtensionState = .unknown

    var body: some View {
        VStack {
            VStack {
                Image("Icon")
                    .resizable()
                    .frame(width: 64.0, height: 64.0)
                Text("Purity")
                    .font(.largeTitle)
                    .fontWeight(.bold)
            }
            .padding([.vertical], 4)
            Group {
                switch extensionState {
                case .unknown:
                    Text("If it's not enabled yet, you can enable the extension in Settings.")
                case .disabled:
                    Text("Enable this extension in Safari Extensions preferences.")
                case .enabled:
                    Text("The extension is already enabled. You can close this window.")
                }
            }
            .padding([.horizontal])
        }
        .onAppear {
            Task {
                extensionState = await ExtensionState.getState()
            }
        }
        #if os(macOS)
        .frame(width: 800, height: 600)
        #endif
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
